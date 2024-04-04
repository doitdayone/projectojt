package com.example.projectojt.controller;

import com.example.projectojt.model.User;
import com.example.projectojt.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AdminController {
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/admin")
    public String adminHome(ModelMap Model, HttpSession session){
        User admin = userRepository.findByUserID((int)session.getAttribute("user_id"));
        if (admin.getRoles().equals("ADMIN")){
            session.setAttribute("admin",true);

            return "adminHome";
        }
            return "redirect:/EcommerceStore/product";
    }
}
