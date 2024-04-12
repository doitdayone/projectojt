package com.example.projectojt.controller;

import com.example.projectojt.model.Feedback;
import com.example.projectojt.model.Product;
import com.example.projectojt.model.User;
import com.example.projectojt.repository.FeedbackRepository;
import com.example.projectojt.repository.OrderRepository;
import com.example.projectojt.repository.ProductRepository;
import com.example.projectojt.repository.UserRepository;
import com.example.projectojt.service.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/do-feedback")
    public String reviewProducts(Model model, Authentication authentication,
                                 HttpSession session) {
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
        List<Product> products =  productRepository.findProductsToFeedbackByUser((int) session.getAttribute("user_id"));
        model.addAttribute("user_email", userRepository.findByUserID((int) session.getAttribute("user_id")).getEmail());
        model.addAttribute("products", productRepository.findProductsToFeedbackByUser((int) session.getAttribute("user_id")));
        return "feedback";
    }

    @PostMapping("/submit-feedback")
    public String submitFeedback(@RequestParam("productId") int productId,
                                 @RequestParam("description") String description,
                                 @RequestParam("rate") int rate, HttpSession session) {
        if (description.equals(""))
            return "redirect:/EcommerceStore/do-feedback";

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
