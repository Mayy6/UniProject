package org.example.influxuipg1;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.write.Point;
import com.influxdb.exceptions.UnauthorizedException;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Instant;
import java.util.List;

@SpringBootTest
class InfluxUiPg1ApplicationTests {

    @Test
    void contextLoads() {
    }
    @Test
    void dbTest() {

        String hostUrl = "http://localhost:8086";
//        char[] authToken = "ibO8x79tme6okjKnbDv9qg4G_hx3Vk4c_WYHa8g-SmBQyO0XnjgIVdTQsqdYYIaxFko_c5fp7wWE51bt0NxphQ==".toCharArray();

        try (InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, "yuanyinkai","yuanyinkai122223".toCharArray())) {
//        try (InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, authToken)) {
            String bucket = "sepBucket";
            String org = "sepOrg";

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

                for (FluxTable table : queryApi.query(query, org)) {
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

}
