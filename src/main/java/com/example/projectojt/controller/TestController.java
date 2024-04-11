package com.example.projectojt.controller;

import com.example.projectojt.model.Product;
import com.example.projectojt.model.User;
import com.example.projectojt.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class TestController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/od")
    public  String getod(HttpSession session, Model model){
        User user = userRepository.findByUserID((Integer) session.getAttribute("user_id"));
        model.addAttribute("user",user);
        return "profile1";
    }
    @GetMapping("/ca")
    public  String getca(){
        return "cart";
    }

}
