package com.example.projectojt.config;


import com.example.projectojt.model.User;
import com.example.projectojt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Configuration
public class OurUserDetailsService implements UserDetailsService {
  
  private final UserRepository userRepository;

  @Autowired
  public OurUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }



  @Override
  public UserDetails loadUserByUsername(String user_name) throws UsernameNotFoundException {
    Optional<User> user = userRepository.findByEmail2(user_name);
    return user.map(UserInfoDetails::new).orElseThrow(() -> new UsernameNotFoundException("Username not found!"));
  }
}
