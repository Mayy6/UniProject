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
import org.example.influxuipg1.Model.QueryLog;
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
//    private List<User> testUsers = Arrays.asList(
//            new User("777", "yuanyinkai", "123456", "1234@xxx.com", "admin"),
//            new User("777", "yyk","123456", "1234@xxx.com", "admin")
//    );

    @Autowired
    JwtTokenUtil jwtTokenUtil;
    @Autowired
    ApiService apiService;
    InfluxdbRepository influxdbRepository = new InfluxdbRepository();

    @GetMapping("/hello")
    public String hello() {
        return "first message";
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
        return ResponseEntity.ok(new AuthResponse(token));
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
