package org.example.influxuipg1.Model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "query_log")
public class QueryLog {
    @Id
    private String id;
    private String userId;
    private String bucket;
    private String measurement;
    private String fields;
    private String tags;
    private String queryDuration;
    private String resultStatus;
    private String resultCount;
}
