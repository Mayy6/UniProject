package org.example.influxuipg1.Service;

import org.example.influxuipg1.Model.User;
import org.example.influxuipg1.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApiService {
    @Autowired
    private UserRepository userRepository;

    public User selectUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User selectUserByName(String id) {
        return userRepository.findByName(id);
    }
}
