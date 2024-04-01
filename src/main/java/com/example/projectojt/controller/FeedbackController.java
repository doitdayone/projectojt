package com.example.projectojt.controller;

import com.example.projectojt.model.Feedback;
import com.example.projectojt.repository.FeedbackRepository;
import com.example.projectojt.repository.ProductRepository;
import com.example.projectojt.repository.UserRepository;
import com.example.projectojt.service.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/EcommerceStore")
public class FeedbackController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductService productService;

    @GetMapping("/do-feedback")
    public String reviewProducts(Model model, HttpSession session) {
        model.addAttribute("products", productRepository.findProductsToFeedbackByUser((int) session.getAttribute("user_id")));
        return "feedback";
    }

    @PostMapping("/submit-feedback")
    public String submitFeedback(@RequestParam("productId") int productId,
                                 @RequestParam("description") String description,
                                 @RequestParam("rate") int rate, HttpSession session) {

        Feedback feedback = new Feedback();
        feedback.setProduct(productRepository.getProductByProductID(productId));
        feedback.setDescription(description);
        feedback.setRating(rate);
        feedback.setUser(userRepository.findByUserID((int) session.getAttribute("user_id")));

        feedbackRepository.save(feedback);
        productService.setRating(productRepository.getProductByProductID(productId));
        return "redirect:/EcommerceStore/do-feedback";
    }
}
