package org.example.influxuipg1;

import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.influxdb.client.*;
import com.influxdb.client.domain.Bucket;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.influxdb.exceptions.UnauthorizedException;
import org.example.influxuipg1.Service.ApiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SpringBootTest
class InfluxUiPg1ApplicationTests {
    @Test
    public void test1() {
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
                        System.out.println("system val: " + measurement);
                    } else {
                        System.out.println("Measurement: " + measurement);
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
                                System.out.println("  Tag Key: " + tagKey);
                                JSONObject tag = new JSONObject();
                                // 获取Tag Values
                                String queryTagValues = String.format("import \"influxdata/influxdb/schema\"\nschema.tagValues(bucket: \"%s\", tag: \"%s\", predicate: (r) => r._measurement == \"%s\")", bucket, tagKey, measurement);                            List<FluxTable> tagValueResults = queryApi.query(queryTagValues);
                                JSONArray values = new JSONArray();
                                tagValueResults.forEach(tagValueTable -> {
                                    tagValueTable.getRecords().forEach(tagValueRecord -> {
                                        String tagValue = tagValueRecord.getValueByKey("_value").toString();
                                        System.out.println("    Tag Value: " + tagValue);
                                        values.put(tagValue);
                                    });
                                });
                                try {
                                    if (values.length() > 0) {
                                        System.out.println(1);
                                    }
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
                                System.out.println("  Field Key: " + fieldKey);
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
        System.out.println(results);
    }


    @Autowired
    ApiService apiService;

    @Test
    void loadData() {
        List<String> measurements = apiService.getMeasurements("sepBucket");
        ArrayList<List<Map<String, List<String>>>> lists = new ArrayList<>();
        for (String s : measurements) {
            List<Map<String, List<String>>> sepBuckets = apiService.getTagValues("sepBucket", s);
            lists.add(sepBuckets);
        }
        System.out.println(lists);
    }


    @Test
    void dbCreateTestInfluxDB() {
        String hostUrl = "http://localhost:8086";
        try (InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, "yuanyinkai", "yuanyinkai".toCharArray())) {
            String bucket = "sepBucket";
            String org = "sepOrg";


            List<Bucket> buckets = client.getBucketsApi().findBuckets();
            for (Bucket bucket1 : buckets) {
                System.out.println(bucket1.getName());
            }
            Instant now = Instant.now();
            Point[] points = new Point[200];
            for (int i = 0; i < 100; i++) {
                Point point = Point.measurement("sepTest")
                        .addTag("location", "Portland")
                        .addTag("tag_test", "test1")
                        .time(now.minusSeconds(i), WritePrecision.S)
                        .addField("ants", i);
                points[i] = point;
            }
            for (int i = 100; i < 200; i++) {
                Point point = Point.measurement("sepTest")
                        .addTag("location", "Queensland")
                        .time(now.minusSeconds(i), WritePrecision.S)
                        .addField("bees", i-50);
                points[i] = point;
            }
            WriteApiBlocking writeApi = client.getWriteApiBlocking();
            for (Point point : points) {
                writeApi.writePoint(bucket, org, point);
            }

            System.out.println("Complete. Return to the InfluxDB UI.");
        }
    }


    @Test
    void dbTestInfluxDB() {
        long start = System.currentTimeMillis();
        String hostUrl = "http://localhost:8086";
        try (InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, "yuanyinkai", "yuanyinkai".toCharArray())) {
            String bucket = "sepBucket";
            String org = "sepOrg";
            String query = "from(bucket: \"sepBucket\")\n" +
                    "  |> range(start: -40d, stop: -10m)\n" +
                    "  |> filter(fn: (r) => r[\"_measurement\"] == \"testMeasurement4\")\n" +
                    "  |> filter(fn: (r) => r[\"_field\"] == \"ants\" or r[\"_field\"] == \"bees\")\n" +
                    "  |> filter(fn: (r) => r[\"location\"] == \"Portland\" or r[\"location\"] == \"Queensland\")";
            QueryApi influxQLQueryApi = client.getQueryApi();
            List<FluxTable> tables = influxQLQueryApi.query(query, org);
            long end = System.currentTimeMillis();
            System.out.println(end - start);
            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    System.out.println(record);
                }
            }



            // 关闭客户端
            client.close();

        }
    }

    @Test
    void createGrafanaDashboard() throws IOException, InterruptedException {
        String key = "glsa_59XrtzqaLhSMrlep4eCcGvPsXCaf9xE6_b83d1d4f";
        String url = "http://localhost:3000/api/dashboards/db";
        String query = "from(bucket: \"sepBucket\")\n" +
                "  |> range(start: -40d, stop: -10m)\n" +
                "  |> filter(fn: (r) => r[\"_measurement\"] == \"testMeasurement4\")\n" +
                "  |> filter(fn: (r) => r[\"_field\"] == \"ants\" or r[\"_field\"] == \"bees\")\n" +
                "  |> filter(fn: (r) => r[\"location\"] == \"Portland\" or r[\"location\"] == \"Queensland\")\n" +
                "  |> yield(name: \"mean\")";
        String dashboardJson = "{" +
                "  \"dashboard\": {\n" +
                "    \"title\": \"sepTes\",\n" +
                "    \"panels\": [{\n" +
                "      \"type\": \"graph\",\n" +
                "      \"title\": \"Test Panel\",\n" +
                "      \"datasource\": \"influxdb1\",\n" +
                "      \"targets\": [{\n" +
                "        \"query\": \"from(bucket: \\\"leon\\\") |> range(start: -7d) |> filter(fn: (r) => r._measurement == \\\"census\\\")\",\n" +
                "        \"type\": \"flux\"\n" +
                "      }],\n" +
                "      \"gridPos\": {\"x\": 0, \"y\": 0, \"w\": 24, \"h\": 8}\n" +
                "    }],\n" +
                "    \"schemaVersion\": 30,\n" +
                "    \"version\": 1\n" +
                "  },\n" +
                "  \"folderId\": 0,\n" +
                "  \"overwrite\": false\n" +
                "}\n";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + key)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(dashboardJson))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        String responseBody = response.body();
        String uid = extractUidFromResponse(responseBody);
        System.out.println("Dashboard created with UID: " + uid);
    }


    private String extractUidFromResponse(String responseBody) {
        Pattern pattern = Pattern.compile("\"uid\":\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(responseBody);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    @Test
    void updateGrafanaDashboard() throws IOException, InterruptedException {
        String uid = "your-dashboard-uid";
        String key = "glsa_59XrtzqaLhSMrlep4eCcGvPsXCaf9xE6_b83d1d4f";
        String url = "http://localhost:3000/api/dashboards/db";
        String updatedDashboardJson = "{" +
                "  \"dashboard\": {\n" +
                "    \"uid\": \"" + uid + "\",\n" +
                "    \"title\": \"sepTes Updated\",\n" +
                "    \"panels\": [{\n" +
                "      \"type\": \"graph\",\n" +
                "      \"title\": \"Updated Panel\",\n" +
                "      \"datasource\": \"influxdb1\",\n" +
                "      \"targets\": [{\n" +
                "        \"query\": \"from(bucket: \\\"leon\\\") |> range(start: -7d) |> filter(fn: (r) => r._measurement == \\\"census\\\")\",\n" +
                "        \"type\": \"flux\"\n" +
                "      }],\n" +
                "      \"gridPos\": {\"x\": 0, \"y\": 0, \"w\": 24, \"h\": 8}\n" +
                "    }],\n" +
                "    \"schemaVersion\": 30,\n" +
                "    \"version\": 2\n" +
                "  },\n" +
                "  \"folderId\": 0,\n" +
                "  \"overwrite\": true\n" +
                "}\n";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + key)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(updatedDashboardJson))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Updated Dashboard: " + response.body());
    }

    @Test
    void deleteGrafanaDashboard() throws IOException, InterruptedException {
        String uid = "your-dashboard-uid";  // 替换为实际的仪表盘 UID
        String url = "http://localhost:3000/api/dashboards/uid/" + uid;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer glsa_59XrtzqaLhSMrlep4eCcGvPsXCaf9xE6_b83d1d4f")
                .DELETE()

                .DELETE()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Delete response: " + response.body());
    }
}


                  
                      
               
   
