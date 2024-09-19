package org.example.influxuipg1;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DatabaseService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String createDatabase(String dbName, String username, String password) {
        try {
            //  Create a database
            String createDbQuery = "CREATE DATABASE " + dbName;
            jdbcTemplate.execute(createDbQuery);

            // Create a user with the specified username and password
            String createUserQuery = "CREATE USER " + username + " WITH PASSWORD '" + password + "'";
            jdbcTemplate.execute(createUserQuery);

            // Grant all privileges on the newly created database to the user
            String grantPrivilegesQuery = "GRANT ALL PRIVILEGES ON DATABASE " + dbName + " TO " + username;
            jdbcTemplate.execute(grantPrivilegesQuery);

            return "Database and user created successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error creating database or user: " + e.getMessage();
        }
    }
}