package com.example.projectojt.controller;

import com.example.projectojt.model.Product;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class TestController {

    @GetMapping("/test")
    public String getTest(Model model){
        List<Product> mouseProducts = new ArrayList<>();
        Product p1 = new Product();
        p1.setProductID(1);
        p1.setName("@@@@");
        p1.setPrice(333333);
        p1.setQuantity(333);
        p1.setType("mouse");
        mouseProducts.add(p1);
        model.addAttribute("mouseProducts", mouseProducts);
        model.addAttribute("screenProducts", mouseProducts);
        model.addAttribute("laptopProducts", mouseProducts);
        for (Product p:mouseProducts
             ) {
            System.err.println(p.getProductID());
        }
        return "testpopup";
    }
    @GetMapping("/mouseProducts")
    public String getMouseProducts(Model model) {
        // Lấy danh sách sản phẩm loại mouse từ repository hoặc dữ liệu mẫu
        List<Product> mouseProducts = new ArrayList<>();
        Product p1 = new Product();
        p1.setProductID(1);
        p1.setPrice(333333);
        p1.setQuantity(333);
        p1.setType("mouse");
        mouseProducts.add(p1);
        p1.setProductID(2);
        mouseProducts.add(p1);
        p1.setProductID(3);
        mouseProducts.add(p1);
        model.addAttribute("mouseProducts", mouseProducts);
        return "mousePopup"; // Trả về view cho popup của mouse
    }

    @GetMapping("/screenProducts")
    public String getScreenProducts(Model model) {
        // Lấy danh sách sản phẩm loại screen từ repository hoặc dữ liệu mẫu
        List<Product> screenProducts = new ArrayList<>();
        Product p1 = new Product();
        p1.setProductID(1);
        p1.setPrice(333333);
        p1.setQuantity(333);
        p1.setType("screen");
        screenProducts.add(p1);
        p1.setProductID(2);
        screenProducts.add(p1);
        model.addAttribute("screenProducts", screenProducts);
        return "screenPopup"; // Trả về view cho popup của screen
    }

    @GetMapping("/laptopProducts")
    public String getLaptopProducts(Model model) {
        // Lấy danh sách sản phẩm loại laptop từ repository hoặc dữ liệu mẫu
        List<Product> laptopProducts = new ArrayList<>();
        Product p1 = new Product();
        p1.setProductID(1);
        p1.setPrice(333333);
        p1.setQuantity(333);
        p1.setType("mouse");
        model.addAttribute("laptopProducts", laptopProducts);
        return "laptopPopup"; // Trả về view cho popup của laptop
    }
}
