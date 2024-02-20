package com.example.projectojt.controller;


import com.example.projectojt.model.Product;
import com.example.projectojt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ProductController {
    @Autowired private ProductService service;

    @GetMapping("/manageProduct")
    public String showProductList(Model model){
        List<Product> listProducts = service.listAll();
        model.addAttribute("listProducts", listProducts);

        return "manageProduct";
    }
    @GetMapping("/createProduct")
    public String createProduct(ModelMap Model){
        return "createProduct";
    }
}
