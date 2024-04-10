package com.example.projectojt.controller;

import com.example.projectojt.Key.CartID;
import com.example.projectojt.model.Cart;
import com.example.projectojt.model.Product;
import com.example.projectojt.model.User;
import com.example.projectojt.repository.CartRepository;
import com.example.projectojt.repository.ProductRepository;
import com.example.projectojt.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/EcommerceStore")
public class CartController {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    ProductRepository productRepository;
    @Autowired
    UserRepository userRepository;


    @GetMapping("/cart/{user_id}")
    public String viewCart(@PathVariable("user_id") int user_id, Model model, HttpSession session, Authentication authentication) {
        ArrayList<Cart> cartItemList = cartRepository.findCartsByUserID(user_id);
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

        if (cartItemList == null) {
            int total = 0;
            model.addAttribute("total", total);
            model.addAttribute("error", "Your cart is empty");
            cartItemList = new ArrayList<Cart>();
        }

        model.addAttribute("productRepository", productRepository);
        model.addAttribute("cartItemList", cartItemList);
        model.addAttribute("user_id", user_id);
        session.setAttribute("cartItemList", cartItemList);
        int total = getTotal(cartItemList);

        model.addAttribute("total", total);


        return "cart";
    }

    @PostMapping("/cart/add")
    public String addToCart(@RequestParam("product_id") int product_id,
                            @RequestParam("user_id") int user_id, Model model, HttpSession session) {
        try {
            Optional<Product> productOptional = productRepository.findById(product_id);

            if (productOptional.isPresent()) {
                Product product = productOptional.get();

                // retrieve or create a user based on the user_id
                User user = userRepository.findByUserID(user_id);

                if (user != null) {
                    ArrayList<Cart> cartItemList = cartRepository.findCartsByUserID(user_id);
                    Optional<Cart> existingItem = cartItemList.stream()
                            .filter(item -> item.getCartID().getProduct().getProductID() == (product.getProductID()))
                            .findFirst();
                    if (existingItem.isPresent()) {
                        existingItem.get().setQuantity(existingItem.get().getQuantity() + 1);
                        cartRepository.save(existingItem.get());
                    } else {
                        // create new cart_item if product have not been in cart yet
                        Cart cartItem = new Cart();
                        CartID cartID = new CartID(user,product);
                        cartItem.setCartID(cartID);
                        cartItem.setQuantity(1);

                        cartRepository.save(cartItem);
                    }
                    cartItemList = cartRepository.findCartsByUserID(user_id);
                    model.addAttribute("cartItemList", cartItemList);
                    session.setAttribute("cartItemList", cartItemList);
                    int total = getTotal(cartItemList);
                    if (cartItemList == null) {
                        total = 0;
                        model.addAttribute("total", total);
                    } else {
                        model.addAttribute("total", total);
                    }
                    model.addAttribute("productRepository", productRepository);
                    model.addAttribute("user_id", user_id);
                    // Set the user in the cart
                    model.addAttribute("userRepository", userRepository);

                    return "cart";
                } else {

                    return "error";
                }
            } else {
                //handle product not found
                return "error";
            }
        } catch (Exception ex) {
            model.addAttribute("error", ex);
            return "error";
        }
    }

    // update quantity of product
    @PostMapping("/cart/updateQuantity")
    public String updateQuantity(@RequestParam("cartItemId") int cartItemId,

                                 @RequestParam("action") String action,
                                 @RequestParam("user_id") int user_id,
                                 Model model, HttpSession session) {
        try {
            CartID cartID = new CartID(userRepository.findByUserID(user_id), productRepository.getProductByProductID(cartItemId));
            Cart cartItem = cartRepository.findById(cartID)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid cart item Id: " + cartItemId));

            if ("increase".equalsIgnoreCase(action)) {
                cartItem.setQuantity(cartItem.getQuantity() + 1);
                cartRepository.save(cartItem);
            } else if ("decrease".equalsIgnoreCase(action)) {
                if (cartItem.getQuantity() > 1) {
                    cartItem.setQuantity(cartItem.getQuantity() - 1);
                    cartRepository.save(cartItem);

                } else {
                    removeItem(cartItemId, user_id, model);
                    return "cart";
                }
            }

            ArrayList<Cart> cartItemList = cartRepository.findCartsByUserID(user_id);
            session.setAttribute("cartItemList", cartItemList);
            model.addAttribute("cartItemList", cartItemList);
            int total = getTotal(cartItemList);
            if (cartItemList == null) {
                total = 0;
                model.addAttribute("total", total);
            } else {
                model.addAttribute("total", total);
            }
            model.addAttribute("productRepository", productRepository);
            model.addAttribute("user_id", user_id);
            cartRepository.save(cartItem);

            return "cart";
        } catch (Exception ex) {
            model.addAttribute("error", ex.getMessage());
            return "error";
        }
    }

    @PostMapping("/cart/removeItem")
    public String removeItem(@RequestParam("cartItemId") int cartItemId,
                             @RequestParam("user_id") int user_id, Model model) {
        try {
            CartID cartID = new CartID(userRepository.findByUserID(user_id), productRepository.getProductByProductID(cartItemId));
            Cart cartItem = cartRepository.findById(cartID)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid cart item Id: " + cartItemId));
            cartRepository.delete(cartItem);
            // You may want to update the cart or related data here if needed
            ArrayList<Cart> cartItemList = cartRepository.findCartsByUserID(user_id);
            model.addAttribute("cartItemList", cartItemList);

            int total = getTotal(cartItemList);
            if (cartItemList == null) {
                total = 0;
                model.addAttribute("total", total);
            } else {
                model.addAttribute("total", total);
            }

            model.addAttribute("productRepository", productRepository);
            model.addAttribute("user_id", user_id);
            return "cart";
        } catch (Exception ex) {
            model.addAttribute("error", ex.getMessage());
            return "error";
        }

    }

    public int getTotal(List<Cart> cartItemList) {
        if (cartItemList == null) {
            return 0;
        } else {
            int total = 0;
            for (Cart c : cartItemList) {
                total += c.getQuantity() * c.getCartID().getProduct().getPrice();
            }
            return total;
        }


    }

}