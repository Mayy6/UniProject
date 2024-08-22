package org.example.influxuipg1.Model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class User {
    public User(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public User() {
    }

    @Id
    private String id;

    private String name;
}
