package com.example.projectojt.controller;

import com.example.projectojt.model.Product;
import com.example.projectojt.model.User;
import com.example.projectojt.repository.FeedbackRepository;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequestMapping("/EcommerceStore")
@Controller
public class ProductController {

  @Autowired
  private ProductRepository productRepository;
  @Autowired
  private UserRepository userRepository;
  //  @Autowired
//  private ProductService productService;
  @Autowired
  private ProductService productService;
  @Autowired
  private FeedbackRepository feedbackRepository;

  @GetMapping("/product")
  public String getProduct(Authentication authentication, Model model,
                           @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo, HttpSession session) {
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();

      if (principal instanceof UserDetails userDetails) {
        // Standard UserDetails case
        String email = userDetails.getUsername();
        model.addAttribute("user_email", email);
        User user = userRepository.findByEmail(email);
        model.addAttribute("userRepository", userRepository);
        int user_id = user.getUserID();
        model.addAttribute("user_id", user_id);
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


    List<Product> productList = productService.getInitialProducts();
    model.addAttribute("productList", productList);

    List<Product> listPhone = productRepository.findProductsByType("Phone");
    model.addAttribute("listPhone", listPhone);
    List<Product> listLaptop = productRepository.findProductsByType("Laptop");
    model.addAttribute("listLaptop", listLaptop);
    List<Product> listEarPhone = productRepository.findProductsByType("Ear Phone");
    model.addAttribute("listEarPhone", listEarPhone);
    return "homepage";
  }

  @GetMapping("/products/more")
  public String getMoreProduct(Model model, @RequestParam int page, @RequestParam int size) {
    List<Product> moreProducts = productService.getMoreProducts(page, size);
    model.addAttribute("productListMore", moreProducts);
    return "homepage"; // Trả về một fragment chứa danh sách sản phẩm mới
  }

  @GetMapping("/productDetails/{productId}")
  public String getProductDetails(@PathVariable("productId") Integer productId,
      Authentication authentication, Model model) {
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();

      if (principal instanceof UserDetails userDetails) {
        // Standard UserDetails case
        String email = userDetails.getUsername();
        model.addAttribute("user_email", email);
        User user = userRepository.findByEmail(email);
        model.addAttribute("userRepository", userRepository);
        int user_id = user.getUserID();
        model.addAttribute("user_id", user_id);
      } else if (principal instanceof OAuth2User oAuth2User) {
        // get user_email when sign in with google or facebook
        Map<String, Object> attributes = oAuth2User.getAttributes();
        model.addAttribute("user_email",
            attributes.get("email"));
        model.addAttribute("userRepository", userRepository);


      } else {
        return "error";
      }

    } else {
      model.addAttribute("user_email", " ");
      model.addAttribute("user_id", -1);
      model.addAttribute("userRepository", userRepository);

    }
    Optional<Product> optionalProduct = productRepository.findById(productId);
    if (optionalProduct.isPresent()) {
      model.addAttribute("productRepository", productRepository);
      model.addAttribute("product", optionalProduct.get());
      model.addAttribute("feedbackList", optionalProduct.get().getFeedbacks());
      return "productDetails";
    }

    return "error";
  }

  @GetMapping("/productFilter/{product_type}")
  public String productFilter(@PathVariable("product_type") String product_type, Model model) {
    List<Product> listProduct = productRepository.findProductsByType(product_type);
    model.addAttribute("listProduct", listProduct);
    model.addAttribute("productType", product_type);
    return "productFilter";
  }

  @GetMapping("/productBrandFilter/{product_brand}")
  public String findByProductBrand(@PathVariable("product_brand") String product_brand,
      Model model) {
    List<Product> listProduct = productRepository.findProductsByBrand(product_brand);
    model.addAttribute("listProduct", listProduct);
    model.addAttribute("productType", "Laptop");
    return "productFilter";
  }

  @GetMapping("/productFilter")
  public String findProductByPrice(@RequestParam("start_price") int start_price,
      @RequestParam("end_price") int end_price, @RequestParam("productType") String productType,
      Model model) {
    List<Product> listProduct = productRepository.findProductsByPriceBetweenAndType(
        start_price,
        end_price, productType);
    model.addAttribute("listProduct", listProduct);
    model.addAttribute("productType", productType);
    return "productFilter";
  }

  @GetMapping("/search")
  public String searchProduct(@RequestParam String keyword,
      @RequestParam int page, @RequestParam int size,
      Model model) {

    List<Product> productList = productService.searchProduct(keyword);
    List<Product> pList = productService.getMoreSearchProduct(keyword, page, size);
    model.addAttribute("productList", productList);
    model.addAttribute("productListMore", pList);
    model.addAttribute("keyword", keyword);
    return "homepage";
  }

}
