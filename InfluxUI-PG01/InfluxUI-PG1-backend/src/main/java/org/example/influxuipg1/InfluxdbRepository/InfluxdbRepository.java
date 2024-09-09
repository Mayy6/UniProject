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
        char[] token = "0QQ9rrYuBMhfKGk3wBKjxL0dBBHnzsuTfc6K6zhUcd5-uJmlmgalFPbNF9hjl-wE_ixZavehxQX2HZoUN6kebA==".toCharArray();
        String org = "f569ebf7d29af181";
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


