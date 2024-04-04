package com.example.projectojt.controller;

import com.example.projectojt.model.User;
import com.example.projectojt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.Timestamp;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/EcommerceStore")
public class LoginController {

  @Autowired
  PasswordEncoder passwordEncoder;
  @Autowired
  UserRepository userRepository;

  @GetMapping("/loginpage")
  public String login() {
    return "login";
  }

  @PostMapping("/login")
  public String login(@RequestParam String username, @RequestParam String password, Model model) {
    Optional<User> user = userRepository.findByEmail2(username);
    if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
      // auth successful, redirect to the product page
      if(username.equals("admin@admin.123"))
        return "redirect:/admin";
      return "redirect:/EcommerceStore/product";
    }
    else {
      // auth failed, set error message and return to login page
      model.addAttribute("errorlogin", "Invalid username or password");
      return "login";
    }
  }


  @PostMapping("/signingoogle")
  public String currentUser(OAuth2AuthenticationToken oAuth2AuthenticationToken) {
    Map<String, Object> attributes = oAuth2AuthenticationToken.getPrincipal().getAttributes();

    // Convert attributes to User object
    User user = toUser(attributes);
    System.out.println("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
    System.out.println(!userRepository.existsByEmail(user.getEmail()));
    if (!userRepository.existsByEmail(user.getEmail())) {
      userRepository.save(user);
    }
    return "redirect:/EcommerceStore/product";
  }

  public User toUser(Map<String, Object> map) {
    if (map == null) {
      return null;
    }
    User user = new User();
    user.setEmail((String) map.get("email"));
    user.setUserName((String) map.get("name"));
    user.setRoles("USER");
    user.setPassword("");
    user.setPhone("");
    user.setBirthday(Timestamp.valueOf("1990-01-01 00:00:00"));

    return user;
  }

  @GetMapping("/signinfacebook")

  public String currentFacebookUser(OAuth2AuthenticationToken oAuth2AuthenticationToken) {
    Map<String, Object> attributes = oAuth2AuthenticationToken.getPrincipal().getAttributes();

    // convert attributes to User object for Facebook
    User user = toFacebookUser(attributes);

    if (!userRepository.existsByEmail(user.getEmail())) {
      userRepository.save(user);
    }
    return "redirect:/EcommerceStore/product";
  }




  public User toFacebookUser(Map<String, Object> map) {
    if (map == null) {
      return null;
    }

    User user = new User();
    user.setEmail((String) map.get("email"));
    user.setUserName((String) map.get("name"));
    user.setRoles("USER");
    user.setPassword(""); // You may want to handle this differently for Facebook
    user.setPhone("0123123123"); // You may want to handle this differently for Facebook
    user.setBirthday(Timestamp.valueOf("1990-01-01 00:00:00"));

    return user;
  }


}