package com.example.projectojt.controller;

import com.example.projectojt.model.Order;
import com.example.projectojt.model.User;
import com.example.projectojt.repository.FeedbackRepository;
import com.example.projectojt.repository.UserRepository;
import com.example.projectojt.service.OrderService;
import com.example.projectojt.service.StaffService;
import com.example.projectojt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
public class AdminController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderService orderService;
    @Autowired
    private StaffService staffService;
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private UserService userService;
    @GetMapping("/admin")
    public String adminHome(ModelMap Model, HttpSession session){
        long countOrders = orderService.countOrders();
        Model.addAttribute("countOrders", countOrders);
        long countStaffs = staffService.countStaffs();
        Model.addAttribute("countStaffs", countStaffs);
        long countFeedbacks = feedbackRepository.count();
        Model.addAttribute("countFeedbacks", countFeedbacks);
        double totalAmount = orderService.getTotalAmount();
        Model.addAttribute("totalAmount", totalAmount);
        List<Order> orderList = orderService.listAll();
        Model.addAttribute("orderList", orderList);
        List<User> userList = userService.listAll();
        Model.addAttribute("userList", userList);
        User admin = userRepository.findByUserID((int)session.getAttribute("user_id"));
        if (admin.getRoles().equals("ADMIN")){
            session.setAttribute("admin",true);

            return "adminHome";
        }
            return "redirect:/EcommerceStore/product";

    }
}
