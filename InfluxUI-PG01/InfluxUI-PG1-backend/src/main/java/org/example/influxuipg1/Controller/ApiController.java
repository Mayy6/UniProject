package org.example.influxuipg1.Controller;

import com.influxdb.client.BucketsApi;
import com.influxdb.client.InfluxDBClient;
import org.example.influxuipg1.Model.*;
import org.example.influxuipg1.Service.GrafanaService;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.RestTemplate;
import com.influxdb.client.QueryApi;
import com.influxdb.client.domain.Bucket;
import com.influxdb.exceptions.UnauthorizedException;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import jakarta.validation.constraints.NotNull;
import org.example.influxuipg1.InfluxdbRepository.InfluxdbRepository;
import org.example.influxuipg1.Service.ApiService;
import org.example.influxuipg1.Util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {
    private List<User> testUsers = Arrays.asList(
            new User("777", "yuanyinkai", "123456", "1234@xxx.com", "admin"),
            new User("777", "yyk", "123456", "1234@xxx.com", "admin")
    );

    @Autowired
    JwtTokenUtil jwtTokenUtil;
    @Autowired
    ApiService apiService;
    InfluxdbRepository influxdbRepository = new InfluxdbRepository();
    @Autowired
    private GrafanaService grafanaService;

    @GetMapping("/hello")
    public String hello() {
        return "first message";
    }

    @GetMapping("/testPage")
    public ResponseEntity<String> testPage() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        httpHeaders.add("Content-Type","application/json");
        httpHeaders.setBearerAuth("glsa_vMTmHF9gTWMK1jJb1m3bDcUsD3SiaHkn_1c50ef07");
        HttpEntity<String> entity = new HttpEntity<>(httpHeaders);
        String url = "http://localhost:3000/d-solo/b477a3f6-854b-44cf-a7ee-6e498c144aaf/b477a3f6-854b-44cf-a7ee-6e498c144aaf?panelId=1";
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        apiService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }


    @PostMapping("/login")
    public ResponseEntity<?> createToken(@RequestBody AuthRequest authRequest) {
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();
        User user = apiService.selectUserByName(username);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);

        }
        String token = jwtTokenUtil.generateToken(username);
        return ResponseEntity.ok(new AuthResponse(token,username));
    }

    @PostMapping("/query/grafana")
    public ResponseEntity<?> queryGrafana(@RequestBody Query query) throws IOException, InterruptedException {
        String userName = apiService.currentUserName();
        String grafanaDashboard = grafanaService.createGrafanaDashboard("glsa_vMTmHF9gTWMK1jJb1m3bDcUsD3SiaHkn_1c50ef07",userName,query.getSubmit());
        String url = "http://localhost:3000/d-solo/"+grafanaDashboard+"/"+userName+"?panelId=1&theme=light";
        return ResponseEntity.ok(url);
    }

    @PostMapping("/query")
    public String logQuery(
            @RequestParam String username,
            @RequestParam String bucket,
            @RequestParam String measurement,
            @RequestParam String field,
            @RequestParam String tags,
            @RequestParam String query_duration,
            @RequestParam String result_status,
            @RequestParam(required = false) String filter) {

        // Log the query
        apiService.logQuery(username, bucket, measurement, field, tags, query_duration, result_status, filter);

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
            for (Bucket b : buckets) {
                // filter start with "_" buckets,
                // because these buckets are influx default buckets, like "_tasks", "_monitoring"
                // they are used by influx db system, should not be seen.
                if (b.getName().startsWith("_")) {
                    continue;
                }

                // get bucket name here
                bucketNames.add(b.getName());
            }
        } catch (UnauthorizedException e) {
            return ResponseEntity
                    .internalServerError()
                    .body(Collections.singletonList("Connect to influxDB failed."));
        } catch (Exception e) {

            e.printStackTrace();
        }
        return ResponseEntity.ok(bucketNames);
    }


    /**
     * Get specific bucket's measurements.
     *
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
                + "  from(bucket: \"" + bucket + "\")\n"
                + "  |> range(start: -30000d, stop: now())\n"
                + "  |> filter(fn: (r) => true)\n"
                + "  |> keep(columns: [\"_measurement\"])\n"
                + "  |> group()\n"
                + "            |> distinct(column: \"_measurement\")\n"
                + "  |> limit(n: 1000)\n"
                + "  |> sort()\n";

        System.out.println("Query for measurements: " + flux);

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
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(measures);
    }


    /**
     * Get specific measurement's tag keys.
     * @param bucket
     * @param measurement
     * @return
     */
    @GetMapping("/tagkeys")
    public ResponseEntity<List<String>> getTagKeys(@NotNull String bucket, @NotNull String measurement) {
        InfluxDBClient client = influxdbRepository.getInfluxDBClient();
        if (client == null) {
            return ResponseEntity
                    .internalServerError()
                    .body(Collections.singletonList("Connect to influxDB failed."));
        }

        List<String> tagKeys = new ArrayList<>();
        String flux = "\nimport \"influxdata/influxdb/schema\""
                + "\nschema.tagKeys(bucket: \""+bucket+"\", predicate: (r) => r._measurement == \""+measurement+"\")";

        System.out.println("Query for tag keys: "+flux);

        try {
            QueryApi queryApi = client.getQueryApi();
            List<FluxTable> tables = queryApi.query(flux);
            for (FluxTable fluxTable : tables) {
                List<FluxRecord> records = fluxTable.getRecords();
                for (FluxRecord fluxRecord : records) {
                    String tagKey = (String) fluxRecord.getValueByKey("_value");
                    if (tagKey != null && !tagKey.startsWith("_")) {  // Exclude system fields
                        System.out.println("Tag key found: " + tagKey);
                        tagKeys.add(tagKey);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(tagKeys);
    }


    @GetMapping("/tagvalues")
    public ResponseEntity<List<Map<String, List<String>>>> getTagValues(@NotNull String bucket,
                                                                        @NotNull String measurement,
                                                                        @RequestParam(required = false) String tagkeys) {
        InfluxDBClient client = influxdbRepository.getInfluxDBClient();
        if (client == null) {
            return ResponseEntity
                    .internalServerError()
                    .body(Collections.singletonList(Collections.singletonMap("error", Collections.singletonList("Connect to influxDB failed."))));
        }

        List<Map<String, List<String>>> tagsList = new ArrayList<>();  // List to hold the tag key-value pairs

        try {
            QueryApi queryApi = client.getQueryApi();

            // Query all tag keys if no specific tag key is provided
            if (tagkeys == null || tagkeys.isEmpty()) {
                String fluxTagKeysQuery = "\nimport \"influxdata/influxdb/schema\""
                        + "\nschema.tagKeys(bucket: \"" + bucket + "\", predicate: (r) => r._measurement == \"" + measurement + "\")";

                List<FluxTable> tables = queryApi.query(fluxTagKeysQuery);
                List<String> tagKeys = new ArrayList<>();
                for (FluxTable fluxTable : tables) {
                    List<FluxRecord> records = fluxTable.getRecords();
                    for (FluxRecord fluxRecord : records) {
                        String tagKey = (String) fluxRecord.getValueByKey("_value");
                        if (tagKey != null && !tagKey.startsWith("_")) {
                            tagKeys.add(tagKey);
                        }
                    }
                }

                // For each tag key, query the corresponding tag values
                for (String tagKey : tagKeys) {
                    List<String> tagValues = new ArrayList<>();
                    String fluxTagValuesQuery = "\nfrom(bucket: \"" + bucket + "\")"
                            + "\n  |> range(start: -30000d, stop: now())"
                            + "\n  |> filter(fn: (r) => r[\"_measurement\"] == \"" + measurement + "\" and exists r[\"" + tagKey + "\"])"
                            + "\n  |> keep(columns: [\"" + tagKey + "\"])"
                            + "\n  |> distinct(column: \"" + tagKey + "\")"
                            + "\n  |> sort()";

                    List<FluxTable> valueTables = queryApi.query(fluxTagValuesQuery);
                    for (FluxTable valueTable : valueTables) {
                        List<FluxRecord> valueRecords = valueTable.getRecords();
                        for (FluxRecord valueRecord : valueRecords) {
                            String tagValue = (String) valueRecord.getValueByKey("_value");
                            if (tagValue != null) {
                                tagValues.add(tagValue);
                            }
                        }
                    }

                    // Add the tag key and its values as a dictionary to the tags list
                    Map<String, List<String>> tagMap = new HashMap<>();
                    tagMap.put(tagKey, tagValues);
                    tagsList.add(tagMap);
                }
            } else {
                // If a specific tag key is provided, query only that tag key
                List<String> tagValues = new ArrayList<>();
                String fluxTagValuesQuery = "\nfrom(bucket: \"" + bucket + "\")"
                        + "\n  |> range(start: -30000d, stop: now())"
                        + "\n  |> filter(fn: (r) => r[\"_measurement\"] == \"" + measurement + "\" and exists r[\"" + tagkeys + "\"])"
                        + "\n  |> keep(columns: [\"" + tagkeys + "\"])"
                        + "\n  |> distinct(column: \"" + tagkeys + "\")"
                        + "\n  |> sort()";

                List<FluxTable> valueTables = queryApi.query(fluxTagValuesQuery);
                for (FluxTable valueTable : valueTables) {
                    List<FluxRecord> valueRecords = valueTable.getRecords();
                    for (FluxRecord valueRecord : valueRecords) {
                        String tagValue = (String) valueRecord.getValueByKey("_value");
                        if (tagValue != null) {
                            tagValues.add(tagValue);
                        }
                    }
                }

                // Add the tag key and its values as a dictionary to the tags list
                Map<String, List<String>> tagMap = new HashMap<>();
                tagMap.put(tagkeys, tagValues);
                tagsList.add(tagMap);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(Collections.singletonList(Collections.singletonMap("error", Collections.singletonList("Failed to fetch tag values."))));
        }

        return ResponseEntity.ok(tagsList);
    }




    /**
     * Get specific measurement's fields.
     *
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
                + "\n  from(bucket: \"" + bucket + "\")"
                + "\n  |> range(start: -30000d, stop: now())"
                + "\n  |> filter(fn: (r) => (r[\"_measurement\"] == \"" + measurement + "\"))"
                + "\n  |> keep(columns: [\"_field\"])"
                + "\n  |> group()"
                + "\n  |> distinct(column: \"_field\")"
                + "\n  |> limit(n: 1000)"
                + "\n  |> sort()";

        System.out.println("Query for fields: " + flux);

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
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(fields);
    }
}
