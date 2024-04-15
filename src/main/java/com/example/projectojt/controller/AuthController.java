package com.example.projectojt.controller;

import com.example.projectojt.repository.UserRepository;
import com.example.projectojt.request.RegisterRequest;
import com.example.projectojt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
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
  public String register(RegisterRequest registerRequest, BindingResult bindingResult, Model model) {
    if (bindingResult.hasErrors()) {
      model.addAttribute("error", "Email may be already used! Or Passwords are not same");
      return "register_form";
    } else {
      boolean registerResponse = userService.register(registerRequest);
      if (!registerResponse) {
        model.addAttribute("error", "Email may be already used! Or Passwords are not same");
        return "register_form";
      } else {
        model.addAttribute("email", registerRequest.getEmail());
        return "otp_verify";
      }
    }
  }

  @PostMapping("/verify")
  public String verifyUser1(@RequestParam String email, @RequestParam String otp, Model model) {
      boolean verify = userService.verify(email, otp);
      userRepository.findByEmail(email).setVerified(true);
      if (verify)
      return "redirect:/EcommerceStore/login";

      model.addAttribute("error", "OTP does not match!");
      model.addAttribute("email", email);
      return "otp_verify";
  }

  @PostMapping("/verifyOTP")
  public String verifyUser(@RequestParam("email") String email,
                           @RequestParam("otp") String otp, Model model) {

    if(userService.verify(email, otp))
    {
      return "redirect:/EcommerceStore/login";
    } else
    {
      model.addAttribute("error","OTP does not match!");
      model.addAttribute("email", email);
      return "otp_verify";
    }


  }

  @PostMapping("/sendOTP")
  public String re_sentOTP(@RequestParam("email")String email, Model model)
  {
    model.addAttribute("user_email",email);
    userService.send(email);
    return "otp_verify";
  }
  // forgot password
  @GetMapping("/forgot_password")
  public String forgotPassword()
  {
    return "forgot_password";
  }
  // verify otp for change pass
  @PostMapping("/forgot_pass_verify")
  public String verifyChanePass(@RequestParam("email") String email,
                                @RequestParam("otp") String otp, Model model)
  {
    if(userService.verifyForgotPass(email,otp))
    {
      model.addAttribute("user_email", email);
      return "change_new_pass";
    } else
    {
      model.addAttribute("user_email",email);
      model.addAttribute("error","OTP does not match!");
      return "forgot_password_otp";
    }
  }
  @PostMapping("/send_otp_new_pass")
  public String sendOtp(@RequestParam("email")String email, Model model)
  {
    model.addAttribute("user_email",email);
    userService.send(email);
    return "forgot_password_otp";
  }
  @PostMapping("/change_new_pass")
  public String changeNewPass(@RequestParam("email") String email,@RequestParam("new_pass") String newPass,
                              @RequestParam("confirm_new_pass") String confirmNewPass, Model model)
  {
    if(userService.changeNewPass(email,newPass,confirmNewPass))
    {
      return "redirect:/EcommerceStore/loginpage";
    } else
    {
      model.addAttribute("user_email", email);
      model.addAttribute("error_change_pass","Password does not match");
      return "change_new_pass";
    }
  }
}
