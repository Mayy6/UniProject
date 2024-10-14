package org.example.influxuipg1.InfluxdbRepository;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;

public class InfluxdbRepository {
    private InfluxDBClient _influxClient;



    /**
     * Connect to influx db.
     * @return
     */
    public InfluxDBClient getInfluxDBClient() {
        String hostUrl = "http://localhost:8086";
        char[] token = "kNtl8iOvTBQQcl_8h37O_jlPHYJDHdT-lxZ6r0wYD6mIH8_II9nr4TX7wEJc221r9rV7m1saWK4GfrzFvLExrQ==".toCharArray();
        String org = "sepOrg";
        if (null == _influxClient) {
            try {
                _influxClient = InfluxDBClientFactory.create(hostUrl, token, org);
            }
            catch (Exception e) {
                e.printStackTrace();
                System.out.println("Connect to influxDB failed.");
            }
        }
        return _influxClient;
    }
}


