package com.example.projectojt.service;


import com.example.projectojt.model.User;
import com.example.projectojt.repository.UserRepository;
import com.example.projectojt.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

 @Autowired
 UserRepository userRepository;
 @Autowired
  private EmailService emailService;
  @Autowired
  PasswordEncoder passwordEncoder;
  public boolean register(RegisterRequest registerRequest) {
    User existingUser = userRepository.findByEmail(registerRequest.getEmail());
    if (existingUser != null) {
      if (existingUser.isVerified()) {
        return false;
      } else {
          sendVerificationEmail(existingUser.getEmail(), existingUser.getOtp());
          return true;
      }

    } else {


      User users = User.builder()
          .userName("")
          .email(registerRequest.getEmail())
          .password(passwordEncoder.encode(registerRequest.getPassword()))
          .roles("USER")
          .phone("")
          .birthday(Timestamp.valueOf(LocalDateTime.now()))
          .otpGeneratedTime(LocalDateTime.now())
          .build();
      String otp = generateOTP();
      users.setOtp(otp);

      User savedUser = userRepository.save(users);
      sendVerificationEmail(savedUser.getEmail(), otp);
    }


    return true;
  }
  public void verify(String email, String otp) {
    User users = userRepository.findByEmail(email);
    if (users == null){
      throw new RuntimeException("User not found");
    } else if (users.isVerified()) {
      throw new RuntimeException("User is already verified");
    } else if (otp.equals(users.getOtp())) {
      users.setVerified(true);
      userRepository.save(users);
    }else {
      throw new RuntimeException("Internal Server error");
    }
  }


  private String generateOTP(){
    Random random = new Random();
    int otpValue = 100000 + random.nextInt(900000);
    return String.valueOf(otpValue);
  }

  private void sendVerificationEmail(String email,String otp){
    String subject = "Email verification";
    String body ="your verification otp is: "+otp;
    emailService.sendEmail(email,subject,body);
  }
  public void sendNotification(String email,String productName){
    String subject = "Thông báo sản phẩm mới";
    String body ="Sản phẩm "+productName+ " đã có hàng.";
    emailService.sendEmail(email,subject,body);
  }
}