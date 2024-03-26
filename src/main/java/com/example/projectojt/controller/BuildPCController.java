package com.example.projectojt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/EcommerceStore")
@Controller
public class BuildPCController {
    @GetMapping("/buildPC")
    public String buildPCPage(ModelMap Model){
        return "buildPC";
    }
}
