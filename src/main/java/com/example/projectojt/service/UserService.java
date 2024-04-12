package com.example.projectojt.service;


import com.example.projectojt.model.Order;
import com.example.projectojt.model.User;
import com.example.projectojt.repository.UserRepository;
import com.example.projectojt.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
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
      if (registerRequest.getPassword().equals(registerRequest.getRe_password()))
          return false;
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

    //resend otp for verify
    public void send(String email) {
        User user = userRepository.findByEmail(email);

        String otp = generateOTP();
        user.setOtp(otp);
        userRepository.save(user);
        sendVerificationEmail(email, otp);
    }

  public boolean verify(String email, String otp) {
    User users = userRepository.findByEmail(email);
    if (users == null){
      return false;
    } else if (users.isVerified()) {
      return false;
    } else if (otp.equals(users.getOtp())) {
      users.setVerified(true);
      userRepository.save(users);
      return true;
    }else {
      return false;
    }
  }

    public boolean verifyForgotPass(String email, String otp) {
        User user = userRepository.findByEmail(email);
        String lowerCaseEmail = email.toLowerCase();
        if (otp.trim().equals(user.getOtp().trim()) && lowerCaseEmail.equals(
                user.getEmail().toLowerCase())) {
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }

    public void changePass(String current_password, String new_password, String re_new_password,
                           int user_id, Model model, String message_err1, String message_err2) {
        User user = userRepository.findByUserID(user_id);
        if (passwordEncoder.matches(current_password.trim(), user.getPassword().trim())) {

            if (new_password.trim().equalsIgnoreCase(re_new_password.trim())) {
                user.setPassword(passwordEncoder.encode(new_password));
                userRepository.save(user);
            } else {
                model.addAttribute("re_new_pass_error", message_err1);
            }
        } else {
            System.out.println(current_password);
            System.out.println(passwordEncoder.encode(current_password));
            System.out.println(user.getPassword());
            model.addAttribute("cur_pass_error", message_err2);
        }
    }

    // change new password
    public boolean changeNewPass(String email, String new_pass, String confirm_new_pass) {
        User user = userRepository.findByEmail(email);
        if (new_pass.trim().equalsIgnoreCase(confirm_new_pass.trim())) {

            user.setPassword(passwordEncoder.encode(new_pass));
            userRepository.save(user);
            return true;
        } else {
            return false;
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

    public List<User> listAll() {
        return userRepository.findAll(PageRequest.of(0, 6)).getContent();
    }
}