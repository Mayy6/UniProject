package org.example.influxuipg1;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.Bucket;
import com.influxdb.client.write.Point;
import com.influxdb.exceptions.UnauthorizedException;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.List;

@SpringBootTest
class InfluxUiPg1ApplicationTests {

//    @Test
    void contextLoads() {
    }
//    @Test
    void dbTestInfluxDB() {

        String hostUrl = "http://localhost:8086";
//        char[] authToken = "ibO8x79tme6okjKnbDv9qg4G_hx3Vk4c_WYHa8g-SmBQyO0XnjgIVdTQsqdYYIaxFko_c5fp7wWE51bt0NxphQ==".toCharArray();


        try (InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, "yuanyinkai","yuanyinkai123".toCharArray())) {
//        try (InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, authToken)) {
            String bucket = "sepBucket";
            String org = "sepOrg";


            // 查询所有buckets
            List<Bucket> buckets = client.getBucketsApi().findBuckets();
            for (Bucket bucket1 : buckets) {
                System.out.println(bucket1.getName());
            }
            Point[] points = new Point[] {
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 123),
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 130),
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 128),
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 132),
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 129),
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 140)
            };

            WriteApiBlocking writeApi = client.getWriteApiBlocking();
            for (Point point : points) {
                writeApi.writePoint(bucket, org, point);

                Thread.sleep(1000); // separate points by 1 second
            }

            System.out.println("Complete. Return to the InfluxDB UI.");
            try {
                QueryApi queryApi = client.getQueryApi();

                String query = "from(bucket: \"sepBucket\")" +
                        " |> range(start: -10m)";

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
    void doGrafanaTest() throws IOException, InterruptedException {
        String key = "glsa_5QMUc3z3baWouJLLCUpYoDL33emwCn9r_eaeefa7b";
        String url = "http://localhost:3131/api/dashboards/db";
        String dashboardJson = "{" +
                "  \"dashboard\": {\n" +
                "    \"title\": \"sepTestPostMan123\",\n" +
                "    \"panels\": [{\n" +
                "      \"type\": \"graph\",\n" +
                "      \"title\": \"Test Panel\",\n" +
                "      \"datasource\": \"InfluxDB-1\",\n" +
                "      \"targets\": [{\n" +
                "        \"query\": \"from(bucket: \\\"sepBucket\\\") |> range(start: -3h) |> filter(fn: (r) => r._measurement == \\\"census\\\")\",\n" +
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
        System.out.println(response.body()); // Output the response (which contains dashboard ID and URL)

    }



}
