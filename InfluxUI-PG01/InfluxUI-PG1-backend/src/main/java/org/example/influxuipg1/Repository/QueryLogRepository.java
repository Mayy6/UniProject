package org.example.influxuipg1.Repository;

import org.example.influxuipg1.Model.QueryLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QueryLogRepository extends JpaRepository<QueryLog, String> {

    List<QueryLog> findByUserId(String userId);
    Optional<QueryLog> findById(String id);
    List<QueryLog> findByBucket(String bucket);
    List<QueryLog> findByMeasurement(String measurement);




}
