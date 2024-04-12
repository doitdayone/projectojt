package com.example.projectojt.controller;




import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

import com.example.projectojt.model.User;
import com.example.projectojt.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriComponentsBuilder;


@Controller
@RequestMapping("/EcommerceStore")
public class EditProfileController {
 @Autowired
 public PasswordEncoder bCryptPasswordEncoder;
  @Autowired
  public UserRepository userRepository;

  @GetMapping("/profile/{user_email}")
  public String profile(@PathVariable String user_email, Model model) {
    Optional<User> optionalUser = userRepository.findByEmail2(user_email);
    if (optionalUser.isPresent()) {
      User user = optionalUser.get();
      model.addAttribute("user", user);
    }

    return "profile1";
  }
//update profile
@Transactional
@PostMapping("/profile/edit")

public String editProfile(@RequestParam("user_id") int user_id,
                          @RequestParam("user_name") String user_name,
                          @RequestParam("user_phoneNumber") String user_phoneNumber,
                          @RequestParam("birthday") String birthdayString,
                          @RequestParam("password") String password,
                          @RequestParam("user_email") String user_email,
                          Model model, HttpSession session, Authentication authentication) {
    if (authentication != null && authentication.isAuthenticated()) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            // Standard UserDetails case
            String email = userDetails.getUsername();
            model.addAttribute("user_email", email);
            User user = userRepository.findByEmail(email);
            model.addAttribute("userRepository", userRepository);
            int userid = user.getUserID();
            model.addAttribute("user_id", userid);
            session.setAttribute("user_id", userRepository.findByEmail(email).getUserID());

            if (user.getRoles().equals("ADMIN"))
                return "redirect:/admin";
        } else if (principal instanceof OAuth2User oAuth2User) {
            // get user_email when sign in with google or facebook
            Map<String, Object> attributes = oAuth2User.getAttributes();
            model.addAttribute("user_email",
                    attributes.get("email"));

            if(!userRepository.existsByEmail((String) attributes.get("email"))){
                var user =  User.builder().userName((String) attributes.get("name"))
                        .email((String) attributes.get("email")).password("").verified(true).roles("USER").build();
                userRepository.save(user);
                ;
            }
            session.setAttribute("user_id", userRepository.findByEmail((String) attributes.get("email")).getUserID());
            model.addAttribute("userRepository", userRepository);

        } else {
            return "error";
        }
    }
  try {
      Timestamp birthday = null;
    try {
      SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
      Date parsedDate = dateFormat.parse(birthdayString);
      birthday = new Timestamp(parsedDate.getTime());
    } catch (ParseException e) {

      e.printStackTrace();
    }
    String encodePass = bCryptPasswordEncoder.encode(password);
    userRepository.updateUserByUserId(user_id, user_name,user_phoneNumber, birthday, encodePass);

    return "redirect:" + UriComponentsBuilder.fromPath("/EcommerceStore/profile/{user_email}")
        .buildAndExpand(user_email)
        .toUriString(); // redirect to the profile page after successful update
  } catch (Exception ex) {
    model.addAttribute("error", ex.getMessage());
    ex.printStackTrace();
    return "error";
  }
}


}
