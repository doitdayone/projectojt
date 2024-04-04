package com.example.projectojt;

import com.example.projectojt.model.User;
import com.example.projectojt.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DatabaseInit {
    private  static  final Logger logger = LoggerFactory.getLogger(DatabaseInit.class);
    @Bean
    CommandLineRunner intDB(UserRepository userRepository){
        return  new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
                if(!userRepository.existsByEmail("admin@admin.123")){
                    User admin = new User();
                    admin.setEmail("admin@admin.123");
                    admin.setUserName("admin");
                    admin.setRoles("ADMIN");
                    admin.setVerified(true);
                    admin.setPassword(new BCryptPasswordEncoder().encode("admin"));
                    userRepository.save(admin);
                }
            }
        };
    }

}
