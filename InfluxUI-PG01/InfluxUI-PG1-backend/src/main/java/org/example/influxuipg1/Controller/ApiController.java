package org.example.influxuipg1.Controller;

import org.example.influxuipg1.Model.AuthRequest;
import org.example.influxuipg1.Model.AuthResponse;
import org.example.influxuipg1.Model.User;
import org.example.influxuipg1.Service.ApiService;
import org.example.influxuipg1.Util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class ApiController {
    private List<User> testUsers = Arrays.asList(
            new User("777", "yuanyinkai", "123456", "1234@xxx.com", "admin"),
            new User("777", "yyk","123456", "1234@xxx.com", "admin")
    );

    @Autowired
    JwtTokenUtil jwtTokenUtil;
    @Autowired
    ApiService apiService;

    @GetMapping("/hello")
    public String hello() {
        return "first message";
    }

    @PostMapping("/login")
    public ResponseEntity<?> createToken(@RequestBody AuthRequest authRequest) {
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();
        User user = null;
        for (User testUser : testUsers) {
            if (Objects.equals(username, testUser.getName()) && Objects.equals(password, testUser.getId())) {
                user = testUser;
                break;
            }
        }
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);

        }
        String token = jwtTokenUtil.generateToken(username);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/query")
    public String logQuery(
            @RequestParam String username,
            @RequestParam String query,
            @RequestParam String bucket,
            @RequestParam String measurement,
            @RequestParam String field,
            @RequestParam(required = false) String filter) {

        // Log the query
        apiService.logQuery(username, query, bucket, measurement, field, filter);

        return "Query logged successfully";
    }

    @GetMapping("/selectUser")
    public ResponseEntity<User> selectUser() {
        return ResponseEntity.ok(apiService.selectUserById("777"));
    }
}
