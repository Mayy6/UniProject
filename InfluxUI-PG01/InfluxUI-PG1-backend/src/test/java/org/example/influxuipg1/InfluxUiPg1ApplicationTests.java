package org.example.influxuipg1;

import com.influxdb.client.*;
import com.influxdb.client.domain.Bucket;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.influxdb.exceptions.UnauthorizedException;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SpringBootTest
class InfluxUiPg1ApplicationTests {

    @Test
    void dbTestInfluxDB() {
        String hostUrl = "http://localhost:8086";
        try (InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, "leonhartani", "Csxg1998".toCharArray())) {
            String bucket = "leon";
            String org = "ADL";

            
            List<Bucket> buckets = client.getBucketsApi().findBuckets();
            for (Bucket bucket1 : buckets) {
                System.out.println(bucket1.getName());
            }


            Point[] points = new Point[] {
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 123.0),
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 130.0),
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 128.0),
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 132.0),
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 129.0),  
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 140.0)   
            };

            WriteApiBlocking writeApi = client.getWriteApiBlocking();
            for (Point point : points) {
                writeApi.writePoint(bucket, org, point);
                Thread.sleep(1000);
            }

            System.out.println("Complete. Return to the InfluxDB UI.");
            try {
                QueryApi queryApi = client.getQueryApi();
                String query = "from(bucket: \"leon\") |> range(start: -10m)";

                List<FluxTable> query1 = queryApi.query(query, org);
                for (FluxTable table : query1) {
                    List<FluxRecord> records = table.getRecords();
                    for (FluxRecord record : records) {
                        String field = record.getField();
                        Object value = record.getValue();
                        Instant time = record.getTime();
                        System.out.printf("| %-5s | %-5s | %-30s |%n", field, value, time);
                    }
                }
            } catch (UnauthorizedException e) {
                System.out.println("no authorization");
            }

        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void createGrafanaDashboard() throws IOException, InterruptedException {
        String key = "glsa_59XrtzqaLhSMrlep4eCcGvPsXCaf9xE6_b83d1d4f";
        String url = "http://localhost:3000/api/dashboards/db";
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


                  
                      
               
   
