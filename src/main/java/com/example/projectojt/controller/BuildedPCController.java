package com.example.projectojt.controller;

import com.example.projectojt.model.BuildedPC;
import com.example.projectojt.model.Product;
import com.example.projectojt.repository.BuildedPCRepository;
import com.example.projectojt.repository.ProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/EcommerceStore")
public class BuildedPCController {
    @Autowired
    private BuildedPCRepository pcRepository;
    @Autowired
    private ProductRepository productRepository;
    @GetMapping("/build-pc")
    public String getMapping(Model model)
    {
        List<BuildedPC> pcList = pcRepository.findAll();
        model.addAttribute("pcList",pcList);
        return "build_pc";
    }
    @GetMapping("/build-pc-view")
    public String view(HttpServletRequest request, Model model)
    {
        int pc_id = Integer.parseInt(request.getParameter("pc_id"));
        BuildedPC bPC = pcRepository.findById(pc_id);
        String[] productIdArray = bPC.getProductIds().split(" ");
        List<Product> products = new ArrayList<>();
        for (String id: productIdArray
             ) {
            products.add(productRepository.getProductByProductID(Integer.parseInt(id)));
        }
        model.addAttribute("total", bPC.getPrice());
        model.addAttribute("productList",products);
        return "build_pc_view";
    }
}
