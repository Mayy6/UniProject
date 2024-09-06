package org.example.influxuipg1.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
/*Avoid conflicts with PostgreSQL reserved words by specifying a different table
name using the @Table annotation on the User entity class.*/
@Table(name = "app_user")
public class User {


    public User(String id, String name, String password, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;

    }

    public User() {
    }

    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private String role;
}
