package org.example.influxuipg1.Service;

import org.example.influxuipg1.Model.QueryLog;
import org.example.influxuipg1.Model.User;
import org.example.influxuipg1.Repository.QueryLogRepository;
import org.example.influxuipg1.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ApiService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QueryLogRepository queryLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User selectUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User selectUserByName(String name) {
        return userRepository.findByName(name);
    }

    public boolean validateUserLogin(String username, String password) {
        // check if users in table
        User user = userRepository.findByName(username);
        if (user != null) {
            // verify if its matching
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }

    public void registerUser(String username, String password, String email, String role) {
        User user = new User();
        user.setName(username);
        user.setPassword(passwordEncoder.encode(password)); // 加密密码
        user.setEmail(email);
        user.setRole(role);
        userRepository.save(user);
    }

    public void logQuery(String userId, String bucket, String measurement, String fields, String tags, String queryDuration, String result_status, String filter) {
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
        System.out.println("Saving query log with userId: " + userId + ", bucket: " + bucket + ", measurement: " + measurement);

    }


}
