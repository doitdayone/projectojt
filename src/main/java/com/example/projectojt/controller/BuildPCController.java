package com.example.projectojt.controller;

import com.example.projectojt.model.Product;
import com.example.projectojt.repository.ProductRepository;
import com.example.projectojt.repository.UserRepository;
import com.example.projectojt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/EcommerceStore")
@Controller
public class BuildPCController {
    @Autowired
    private ProductRepository productRepository;
    @GetMapping("/buildPC")
    public String showBuildPCPage(ModelMap model){
        return "buildPC";
    }
    @GetMapping("/buildPC/{product_type}")
    public String buildPCPage(@PathVariable("product_type") String product_type, Model Model){
        List<Product> listProduct = productRepository.findProductsByType(product_type);
        Model.addAttribute("listProduct", listProduct);
        Model.addAttribute("productType", product_type);
        return "buildPC";
    }
}

