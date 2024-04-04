package com.example.projectojt.controller;

import com.example.projectojt.repository.UserRepository;
import com.example.projectojt.request.RegisterRequest;
import com.example.projectojt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/EcommerceStore")
@RequiredArgsConstructor
public class AuthController {

  @Autowired
  private UserService userService;
  @Autowired
  private UserRepository userRepository;

  @GetMapping("/register_form")
  public String register_form()
  {
    return "register_form";
  }
  @PostMapping("/register")
  public String register(RegisterRequest registerRequest, Model model) {
    boolean registerResponse = userService.register(registerRequest);
  if(!registerResponse)
  {
    model.addAttribute("error","Email is already used!");
    return "register_form";
  } else
  {
    model.addAttribute("email", registerRequest.getEmail());
    return "otp_verify";
  }
  }

  @PostMapping("/verify")
  public String verifyUser(@RequestParam String email, @RequestParam String otp, Model model) {
    try {
      userService.verify(email, otp);
      userRepository.findByEmail(email).setVerified(true);
      return "product";
    } catch (RuntimeException e) {
      model.addAttribute("error", e.getMessage());
      return "error";
    }
  }
}
