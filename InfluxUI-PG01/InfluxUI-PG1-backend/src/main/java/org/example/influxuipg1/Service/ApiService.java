package org.example.influxuipg1.Service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.example.influxuipg1.InfluxdbRepository.InfluxdbRepository;
import org.example.influxuipg1.Model.QueryLog;
import org.example.influxuipg1.Model.User;
import org.example.influxuipg1.Repository.QueryLogRepository;
import org.example.influxuipg1.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ApiService {
    InfluxdbRepository influxdbRepository = new InfluxdbRepository();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QueryLogRepository queryLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User selectUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User selectUserByName(String name) {
        return userRepository.findByName(name);
    }

    public boolean validateUserLogin(String username, String password) {
        // check if users in table
        User user = userRepository.findByName(username);
        if (user != null) {
            // verify if its matching
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }

    public void registerUser(User user) {

        user.setId(UUID.randomUUID().toString());  // set unique id
        user.setPassword(passwordEncoder.encode(user.getPassword()));  // Encryption password
        user.setEmail(user.getEmail());
        user.setRole(user.getRole());
        userRepository.save(user);
    }

    public void logQuery(String userId, String bucket, String measurement, String fields, String tags, String queryDuration, String result_status, String filter) {
        QueryLog queryLog = new QueryLog();
        queryLog.setId(UUID.randomUUID().toString()); // generate unique id
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // find user according to userid
        User user = userRepository.findByName(username);
        if (user != null) {
            // set id as user_id in query
            queryLog.setUserId(user.getId());
        }
//        queryLog.setUserId(userId);
        queryLog.setBucket(bucket);
        queryLog.setMeasurement(measurement);
        if(fields != null) {
            queryLog.setFields(fields);
        }
        if (tags != null && !tags.isEmpty()) {
            queryLog.setTags(tags);
        }
        if (queryDuration != null) {
            queryLog.setQueryDuration(queryDuration);
        }



        /*Use the save method of repository to persist this data into the database.*/
        queryLogRepository.save(queryLog);
        System.out.println("Saving query log with userId: " + userId + ", bucket: " + bucket + ", measurement: " + measurement);

    }

    public String currentUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                return ((UserDetails) principal).getUsername();
            } else {
                return principal.toString();
            }
        }

        return "no data";
    }

    public JSONArray getInfluxInfo() {
        JSONArray results = new JSONArray();
        String hostUrl = "http://localhost:8086";
        String bucket = "sepBucket";
        char[] token = "kNtl8iOvTBQQcl_8h37O_jlPHYJDHdT-lxZ6r0wYD6mIH8_II9nr4TX7wEJc221r9rV7m1saWK4GfrzFvLExrQ==".toCharArray();
        String org = "sepOrg";
        InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, token, org);

        try {
            QueryApi queryApi = client.getQueryApi();

            // 获取所有measurements
            String queryMeasurements = String.format("import \"influxdata/influxdb/schema\"\nschema.measurements(bucket: \"%s\")", bucket);
            List<FluxTable> measurementResults = queryApi.query(queryMeasurements);
            for (FluxTable fluxTable : measurementResults) {
                fluxTable.getRecords().forEach(record -> {
                    String measurement = record.getValueByKey("_value").toString();
                    if (measurement.startsWith("storage_") ||measurement.startsWith("query_") || measurement.startsWith("task_")|| measurement.startsWith("service_")|| measurement.startsWith("qc_")|| measurement.startsWith("influxdb_")|| measurement.startsWith("http_")|| measurement.startsWith("go_")|| measurement.startsWith("boltdb_")) {
                        // todo
                    } else {
                        JSONObject _measurement = new JSONObject();
                        try {
                            _measurement.put("_measurement",measurement);
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                        // 获取Tag Keys
                        String queryTagKeys = String.format("import \"influxdata/influxdb/schema\"\nschema.tagKeys(bucket: \"%s\", predicate: (r) => r._measurement == \"%s\")", bucket, measurement);
                        List<FluxTable> tagKeyResults = queryApi.query(queryTagKeys);
                        JSONObject tags = new JSONObject();
                        JSONArray tagArray = new JSONArray();
                        tagKeyResults.forEach(tagKeyTable -> {
                            tagKeyTable.getRecords().forEach(tagKeyRecord -> {
                                JSONObject keyValues = new JSONObject();
                                String tagKey = tagKeyRecord.getValueByKey("_value").toString();
                                JSONObject tag = new JSONObject();
                                // 获取Tag Values
                                String queryTagValues = String.format("import \"influxdata/influxdb/schema\"\nschema.tagValues(bucket: \"%s\", tag: \"%s\", predicate: (r) => r._measurement == \"%s\")", bucket, tagKey, measurement);                            List<FluxTable> tagValueResults = queryApi.query(queryTagValues);
                                JSONArray values = new JSONArray();
                                tagValueResults.forEach(tagValueTable -> {
                                    tagValueTable.getRecords().forEach(tagValueRecord -> {
                                        String tagValue = tagValueRecord.getValueByKey("_value").toString();
                                        values.put(tagValue);
                                    });
                                });
                                try {
                                    tag.put(tagKey,values);
                                    tagArray.put(tag);
                                } catch (JSONException e) {
                                    throw new RuntimeException(e);
                                }
                            });

                        });
                        try {
                            _measurement.put("tags",tagArray);
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                        // 获取Fields
                        String queryFieldKeys = String.format("import \"influxdata/influxdb/schema\"\nschema.fieldKeys(bucket: \"%s\", predicate: (r) => r._measurement == \"%s\")", bucket, measurement);
                        List<FluxTable> fieldKeyResults = queryApi.query(queryFieldKeys);
                        JSONArray fields = new JSONArray();
                        fieldKeyResults.forEach(fieldKeyTable -> {
                            fieldKeyTable.getRecords().forEach(fieldKeyRecord -> {
                                String fieldKey = fieldKeyRecord.getValueByKey("_value").toString();
                                fields.put(fieldKey);
                            });
                        });
                        try {
                            _measurement.put("fields",fields);
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                        results.put(_measurement);
                    }

                });
            }
        } finally {
            client.close();
        }
        return results;
    }

    public List<String> getMeasurements(String bucket) {// connect to influx
        InfluxDBClient client = influxdbRepository.getInfluxDBClient();
        System.out.println("Connect to influxDB failed.");

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
        return measures;
    }

    public List<Map<String, List<String>>> getTagValues( String bucket,String measurement) {
        InfluxDBClient client = influxdbRepository.getInfluxDBClient();
        if (client == null) {
            return null;
        }
        String tagkeys = null;
        List<Map<String, List<String>>> tagsList = new ArrayList<>();  // List to hold the tag key-value pairs

        try {
            QueryApi queryApi = client.getQueryApi();

            // Query all tag keys if no specific tag key is provided
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

        } catch (Exception e) {
            e.printStackTrace();
        }

        return tagsList;
    }

}
