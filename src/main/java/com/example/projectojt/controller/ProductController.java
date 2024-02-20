package com.example.projectojt.controller;


import com.example.projectojt.dto.ProductDTO;
import com.example.projectojt.model.Product;
import com.example.projectojt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;
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
    @GetMapping("/create")
    public String showCreateProduct(Model Model){
        ProductDTO productDto = new ProductDTO();
        Model.addAttribute("productDto", productDto);
        return "createProduct";
    }
    @PostMapping("/create")
    public String createProduct(
            @Valid @ModelAttribute ProductDTO productDto,
            BindingResult result
    ){
        if (productDto.getImages().isEmpty()){
            result.addError(new FieldError("productDto", "images", "The image file is required"));
        }

        if (result.hasErrors()){
            return "createProduct";
        }

        return "manageProduct";
    }
}
