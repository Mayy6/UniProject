package org.example.influxuipg1.Model;

import lombok.Data;

@Data
public class AuthResponse {
    public String jwt;

    public AuthResponse(String jwt) {
        this.jwt = jwt;
    }
}
