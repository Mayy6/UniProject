package org.example.influxuipg1.Service;

import org.example.influxuipg1.Model.QueryLog;
import org.example.influxuipg1.Model.User;
import org.example.influxuipg1.Repository.QueryLogRepository;
import org.example.influxuipg1.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ApiService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QueryLogRepository queryLogRepository;

    public User selectUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User selectUserByName(String id) {
        return userRepository.findByName(id);
    }

    public void logQuery(String userId, String bucket, String measurement, String fields, String tags, String queryDuration) {
        QueryLog queryLog = new QueryLog();
        queryLog.setId(UUID.randomUUID().toString()); // generate unique id
        queryLog.setUserId(userId);
        queryLog.setBucket(bucket);
        queryLog.setMeasurement(measurement);
        if(fields != null) {
            queryLog.setFields(fields);
        }
        if (tags != null && !tags.isEmpty()) {
            queryLog.setTags(tags);
        }
        if (queryDuration != null) {
            queryLog.setQueryDuration(queryDuration);
        }



        /*Use the save method of repository to persist this data into the database.*/
        queryLogRepository.save(queryLog);
    }


}
