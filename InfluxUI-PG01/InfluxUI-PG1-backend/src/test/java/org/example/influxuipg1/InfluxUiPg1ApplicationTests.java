package org.example.influxuipg1;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.write.Point;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;

@SpringBootTest
class InfluxUiPg1ApplicationTests {

    @Test
    void contextLoads() {
    }
//    @Test
    void dbTest() {

        String hostUrl = "http://localhost:8086";
        char[] authToken = "ibO8x79tme6okjKnbDv9qg4G_hx3Vk4c_WYHa8g-SmBQyO0XnjgIVdTQsqdYYIaxFko_c5fp7wWE51bt0NxphQ==".toCharArray();

        try (InfluxDBClient client = InfluxDBClientFactory.create(hostUrl, authToken)) {
            String bucket = "sepBucket";
            String org = "sepOrg";

            Point[] points = new Point[] {
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 23),
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 30),
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 28),
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 32),
                    Point.measurement("census")
                            .addTag("location", "Klamath")
                            .addField("bees", 29),
                    Point.measurement("census")
                            .addTag("location", "Portland")
                            .addField("ants", 40)
            };

            WriteApiBlocking writeApi = client.getWriteApiBlocking();
            for (Point point : points) {
                writeApi.writePoint(bucket, org, point);

                Thread.sleep(1000); // separate points by 1 second
            }

            System.out.println("Complete. Return to the InfluxDB UI.");

        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

    }

}
