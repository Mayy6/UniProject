package org.example.influxuipg1.Model;

import lombok.Data;

@Data
public class GrafanaRequest {
    private String uid;
    private String query;
    private String apiKey;
    private String org;
    private String filed;
    private String bucket;
    private String tag;
}
