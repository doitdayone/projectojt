package com.example.projectojt.controller;

import com.example.projectojt.model.Product;
import com.example.projectojt.repository.ProductRepository;
import com.example.projectojt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/EcommerceStore")
@Controller
public class BuildPCController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    private Product CPU = null;
    private Product Mainboard = null;
    @GetMapping("/buildPC")
    public String showBuildPCPage(ModelMap model){
        List<Product> productCPU = productRepository.findProductsByType("CPU");
        List<Product> productMainboard = productRepository.findProductsByType("Mainboard");
        model.addAttribute("productCPU", productCPU);
        model.addAttribute("productMainboard", productMainboard);
        return "buildPC";
    }

    private void addList(Model model){
        List<Product> productCPU = productRepository.findProductsByType("CPU");
        List<Product> productMainboard = productRepository.findProductsByType("Mainboard");
        model.addAttribute("productCPU", productCPU);
        model.addAttribute("CPU", CPU);
        model.addAttribute("productMainboard", productMainboard);
        model.addAttribute("Mainboard", Mainboard);
    }

    @GetMapping("/chooseCPU")
    public String chooseCPU(Model Model, @RequestParam("id") int id){
        CPU = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deleteCPU")
    public String deleteCPU(Model Model){
        CPU = null;
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/chooseMainboard")
    public String chooseMainboard(Model Model, @RequestParam("id") int id){
        Mainboard = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deleteMainboard")
    public String deleteMainboard(Model Model){
        Mainboard = null;
        addList(Model);
        return "buildPC";
    }

}

