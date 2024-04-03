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
    private Product RAM = null;
    private Product HDD = null;
    private Product SSD = null;
    private Product VGA = null;
    private Product PowerSupply = null;
    private Product Case = null;
    private Product CoolingFan = null;
    @GetMapping("/buildPC")
    public String showBuildPCPage(ModelMap model){
        List<Product> productCPU = productRepository.findProductsByType("CPU");
        List<Product> productMainboard = productRepository.findProductsByType("Mainboard");
        List<Product> productRAM = productRepository.findProductsByType("RAM");
        List<Product> productHDD = productRepository.findProductsByType("HDD");
        List<Product> productSSD = productRepository.findProductsByType("SSD");
        List<Product> productVGA = productRepository.findProductsByType("VGA");
        List<Product> productPowerSupply = productRepository.findProductsByType("PowerSupply");
        List<Product> productCase = productRepository.findProductsByType("Case");
        List<Product> productCoolingFan = productRepository.findProductsByType("CoolingFan");
        model.addAttribute("productCPU", productCPU);
        model.addAttribute("productMainboard", productMainboard);
        model.addAttribute("productRAM", productRAM);
        model.addAttribute("productHDD", productHDD);
        model.addAttribute("productSSD", productSSD);
        model.addAttribute("productVGA", productVGA);
        model.addAttribute("productPowerSupply", productPowerSupply);
        model.addAttribute("productCase", productCase);
        model.addAttribute("productCoolingFan", productCoolingFan);
        return "buildPC";
    }

    private void addList(Model model){
        List<Product> productCPU = productRepository.findProductsByType("CPU");
        List<Product> productMainboard = productRepository.findProductsByType("Mainboard");
        List<Product> productRAM = productRepository.findProductsByType("RAM");
        List<Product> productHDD = productRepository.findProductsByType("HDD");
        List<Product> productSSD = productRepository.findProductsByType("SSD");
        List<Product> productVGA = productRepository.findProductsByType("VGA");
        List<Product> productPowerSupply = productRepository.findProductsByType("PowerSupply");
        List<Product> productCase = productRepository.findProductsByType("Case");
        List<Product> productCoolingFan = productRepository.findProductsByType("CoolingFan");
        model.addAttribute("productCPU", productCPU);
        model.addAttribute("CPU", CPU);
        model.addAttribute("productMainboard", productMainboard);
        model.addAttribute("Mainboard", Mainboard);
        model.addAttribute("productRAM", productRAM);
        model.addAttribute("RAM", RAM);
        model.addAttribute("productHDD", productHDD);
        model.addAttribute("HDD", HDD);
        model.addAttribute("productSSD", productSSD);
        model.addAttribute("SSD", SSD);
        model.addAttribute("productVGA", productVGA);
        model.addAttribute("VGA", VGA);
        model.addAttribute("productPowerSupply", productPowerSupply);
        model.addAttribute("PowerSupply", PowerSupply);
        model.addAttribute("productCase", productCase);
        model.addAttribute("Case", Case);
        model.addAttribute("productCoolingFan", productCoolingFan);
        model.addAttribute("CoolingFan", CoolingFan);
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

    @GetMapping("/chooseRAM")
    public String chooseRAM(Model Model, @RequestParam("id") int id){
        RAM = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deleteRAM")
    public String deleteRAMd(Model Model){
        RAM = null;
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/chooseHDD")
    public String chooseHDD(Model Model, @RequestParam("id") int id){
        HDD = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deleteHDD")
    public String deleteHDD(Model Model){
        HDD = null;
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/chooseSSD")
    public String chooseSSD(Model Model, @RequestParam("id") int id){
        SSD = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deleteSSD")
    public String deleteSSD(Model Model){
        SSD = null;
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/chooseVGA")
    public String chooseVGA(Model Model, @RequestParam("id") int id){
        VGA = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deleteVGA")
    public String deleteVGAd(Model Model){
        VGA = null;
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/choosePowerSupply")
    public String choosePowerSupply(Model Model, @RequestParam("id") int id){
        PowerSupply = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deletePowerSupply")
    public String deletePowerSupply(Model Model){
        PowerSupply = null;
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/chooseCase")
    public String chooseCase(Model Model, @RequestParam("id") int id){
        Case = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deleteCase")
    public String deleteCase(Model Model){
        Case = null;
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/chooseCoolingFan")
    public String chooseCoolingFan(Model Model, @RequestParam("id") int id){
        CoolingFan = productRepository.getProductByProductID(id);
        addList(Model);
        return "buildPC";
    }

    @GetMapping("/deleteCoolingFan")
    public String deleteCoolingFan(Model Model){
        CoolingFan = null;
        addList(Model);
        return "buildPC";
    }
}

