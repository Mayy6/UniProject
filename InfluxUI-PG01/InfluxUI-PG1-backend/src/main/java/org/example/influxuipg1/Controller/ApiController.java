package org.example.influxuipg1.Controller;

import com.influxdb.client.BucketsApi;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.domain.Bucket;
import com.influxdb.exceptions.UnauthorizedException;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import jakarta.validation.constraints.NotNull;
import org.example.influxuipg1.InfluxdbRepository.InfluxdbRepository;
import org.example.influxuipg1.Model.AuthRequest;
import org.example.influxuipg1.Model.AuthResponse;
import org.example.influxuipg1.Model.User;
import org.example.influxuipg1.Service.ApiService;
import org.example.influxuipg1.Util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {
    private List<User> testUsers = Arrays.asList(
            new User("777", "yuanyinkai", "123456", "1234@xxx.com", "admin"),
            new User("777", "yyk","123456", "1234@xxx.com", "admin")
    );

    @Autowired
    JwtTokenUtil jwtTokenUtil;
    @Autowired
    ApiService apiService;
    InfluxdbRepository influxdbRepository = new InfluxdbRepository();

    @GetMapping("/hello")
    public String hello() {
        return "first message";
    }


    @PostMapping("/login")
    public ResponseEntity<?> createToken(@RequestBody AuthRequest authRequest) {
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();
        User user = null;
        for (User testUser : testUsers) {
            if (Objects.equals(username, testUser.getName()) && Objects.equals(password, testUser.getId())) {
                user = testUser;
                break;
            }
        }
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);

        }
        String token = jwtTokenUtil.generateToken(username);
        return ResponseEntity.ok(new AuthResponse(token,username));
    }

    @PostMapping("/query")
    public String logQuery(
            @RequestParam String username,
            @RequestParam String query,
            @RequestParam String bucket,
            @RequestParam String measurement,
            @RequestParam String field,
            @RequestParam(required = false) String filter) {

        // Log the query
        apiService.logQuery(username, query, bucket, measurement, field, filter);

        return "Query logged successfully";
    }

    @GetMapping("/selectUser")
    public ResponseEntity<User> selectUser() {
        return ResponseEntity.ok(apiService.selectUserById("777"));
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(testUsers);  // Return all users
    }

    // Get a specific user by ID
    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        for (User user : testUsers) {
            if (user.getId().equals(id)) {
                return ResponseEntity.ok(user);  // Return the user if found
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Return 404 if user is not found
    }

    // Update a user's information
    @PutMapping("/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        for (User user : testUsers) {
            if (user.getId().equals(id)) {
                // Update user fields with the new values
                user.setName(updatedUser.getName());
                user.setPassword(updatedUser.getPassword());
                user.setEmail(updatedUser.getEmail());
                user.setRole(updatedUser.getRole());
                return ResponseEntity.ok(user);  // Return the updated user information
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Return 404 if user is not found
    }

    // Delete a user by ID
    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        for (Iterator<User> iterator = testUsers.iterator(); iterator.hasNext(); ) {
            User user = iterator.next();
            if (user.getId().equals(id)) {
                iterator.remove();  // Remove the user from the list
                return ResponseEntity.ok("User deleted successfully");  // Return success message
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Return 404 if user is not found
    }


    
    @GetMapping("/bucket")
    public ResponseEntity<List<String>> getBuckets() {
        InfluxDBClient client = influxdbRepository.getInfluxDBClient();
        if (client == null) {
            return ResponseEntity
                    .internalServerError()
                    .body(Collections.singletonList("Connect to influxDB failed."));
        }

        List<String> bucketNames = new ArrayList<>();

        try {
            // query for buckets
            BucketsApi bucketsApi = client.getBucketsApi();
            List<Bucket> buckets = bucketsApi.findBuckets();
            for (Bucket b: buckets) {
                // filter start with "_" buckets,
                // because these buckets are influx default buckets, like "_tasks", "_monitoring"
                // they are used by influx db system, should not be seen.
                if (b.getName().startsWith("_")) {
                    continue;
                }

                // get bucket name here
                bucketNames.add(b.getName());
            }
        }
        catch (UnauthorizedException e) {
            return ResponseEntity
                    .internalServerError()
                    .body(Collections.singletonList("Connect to influxDB failed."));
        }
        catch (Exception e) {

            e.printStackTrace();
        }
        return ResponseEntity.ok(bucketNames);
    }



    /**
     * Get specific bucket's measurements.
     * @param bucket
     * @return
     */
    @GetMapping("/measurement")
    public ResponseEntity<List<String>> getMeasurements(@NotNull String bucket) {// connect to influx

        InfluxDBClient client = influxdbRepository.getInfluxDBClient();
        if (client == null) {
            return ResponseEntity
                    .internalServerError()
                    .body(Collections.singletonList("Connect to influxDB failed."));
        }

        List<String> measures = new ArrayList<>();
        String flux = "import \"regexp\"\n"
                + "  from(bucket: \""+bucket+"\")\n"
                +"  |> range(start: -30000d, stop: now())\n"
                +"  |> filter(fn: (r) => true)\n"
                +"  |> keep(columns: [\"_measurement\"])\n"
                +"  |> group()\n"
                +"            |> distinct(column: \"_measurement\")\n"
                +"  |> limit(n: 1000)\n"
                +"  |> sort()\n";

        System.out.println("Query for measurements: "+flux);

        try {
            QueryApi queryApi = client.getQueryApi();
            List<FluxTable> tables = queryApi.query(flux);
            for (FluxTable fluxTable : tables) {
                List<FluxRecord> records = fluxTable.getRecords();
                for (FluxRecord fluxRecord : records) {
                    System.out.println(fluxRecord.getTime() + ": " + fluxRecord.getValueByKey("_value"));
                    measures.add((String) fluxRecord.getValueByKey("_value"));
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(measures);
    }

    /**
     * Get specific measurement's fields.
     * @param bucket
     * @param measurement
     * @return
     */
    @GetMapping("/field")
    public ResponseEntity<List<String>> getFields(@NotNull String bucket, @NotNull String measurement) {
        InfluxDBClient client = influxdbRepository.getInfluxDBClient();
        if (client == null) {
            return ResponseEntity
                    .internalServerError()
                    .body(Collections.singletonList("Connect to influxDB failed."));
        }

        List<String> fields = new ArrayList<>();
        String flux = "\nimport \"regexp\""
                + "\n"
                + "\n  from(bucket: \""+bucket+"\")"
                + "\n  |> range(start: -30000d, stop: now())"
                + "\n  |> filter(fn: (r) => (r[\"_measurement\"] == \""+measurement+"\"))"
                + "\n  |> keep(columns: [\"_field\"])"
                + "\n  |> group()"
                + "\n  |> distinct(column: \"_field\")"
                + "\n  |> limit(n: 1000)"
                + "\n  |> sort()";

        System.out.println("Query for fields: "+flux);

        try {
            QueryApi queryApi = client.getQueryApi();
            List<FluxTable> tables = queryApi.query(flux);
            for (FluxTable fluxTable : tables) {
                List<FluxRecord> records = fluxTable.getRecords();
                for (FluxRecord fluxRecord : records) {
                    System.out.println(fluxRecord.getTime() + ": " + fluxRecord.getValueByKey("_value"));
                    fields.add((String) fluxRecord.getValueByKey("_value"));
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(fields);
    }
}

