package org.example.influxuipg1.Model;

import lombok.Data;

@Data
public class AuthResponse {
    public String jwt;
    public String userName;

    public AuthResponse(String jwt, String userName) {
        this.jwt = jwt;
        this.userName = userName;
    }
}
