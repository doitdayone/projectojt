package com.example.projectojt.controller;

import com.example.projectojt.Key.CartID;
import com.example.projectojt.model.*;
import com.example.projectojt.repository.*;
import com.example.projectojt.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RequestMapping("/EcommerceStore")
@Controller
public class BuildPCController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private BuildedPCRepository pcRepository;
    @Autowired
    private ProductService productService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AddressRepository userAddressRepository;
    private CartID cartID;
    private Cart CPU = null;
    private Cart Mainboard = null;
    private Cart RAM = null;
    private Cart HDD = null;
    private Cart SSD = null;
    private Cart VGA = null;
    private Cart PowerSupply = null;
    private Cart Case = null;
    private Cart CoolingFan = null;

    private int total = 0;
    private int discount = 0;

    private void countTotal(){
        total =0;
        discount =0;
        List<Cart> carts =new ArrayList<>();
        carts.add(CPU);
        carts.add(Mainboard);
        carts.add(RAM);
        carts.add(HDD);
        carts.add(SSD);
        carts.add(VGA);
        carts.add(PowerSupply);
        carts.add(Case);
        carts.add(CoolingFan);
        for (Cart c:carts
             ) {
            if (c==null) {
                continue;
            }
            total+=c.quantity*c.getCartID().getProduct().getPrice();
            discount+= c.quantity*c.getCartID().getProduct().getPrice()*(100-c.getCartID().getProduct().getSale())/100;
        }
    }


    @GetMapping("/buildPC")
    public String showBuildPCPage(ModelMap model){
        total = 0;
        discount = 0;
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
        model.addAttribute("total",total);
        model.addAttribute("discount",discount);
        //return "buildPC";
        return "BuildPC1";
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
        model.addAttribute("total",total);
        model.addAttribute("discount",discount);
    }

    @GetMapping("/chooseCPU")
    public String chooseCPU(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        CPU = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deleteCPU")
    public String deleteCPU(Model Model){
        CPU = null;
        countTotal();
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/chooseMainboard")
    public String chooseMainboard(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        Mainboard = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deleteMainboard")
    public String deleteMainboard(Model Model){
        Mainboard = null;
        countTotal();
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/chooseRAM")
    public String chooseRAM(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        RAM = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deleteRAM")
    public String deleteRAMd(Model Model){
        RAM = null;
        countTotal();
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/chooseHDD")
    public String chooseHDD(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        HDD = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deleteHDD")
    public String deleteHDD(Model Model){
        HDD = null;
        countTotal();
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/chooseSSD")
    public String chooseSSD(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        SSD = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deleteSSD")
    public String deleteSSD(Model Model){
        SSD = null;
        countTotal();
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/chooseVGA")
    public String chooseVGA(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        VGA = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deleteVGA")
    public String deleteVGAd(Model Model){
        VGA = null;
        countTotal();
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/choosePowerSupply")
    public String choosePowerSupply(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        PowerSupply = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deletePowerSupply")
    public String deletePowerSupply(Model Model){
        PowerSupply = null;
        addList(Model);
        countTotal();
        return "BuildPC1";
    }

    @GetMapping("/chooseCase")
    public String chooseCase(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        Case = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deleteCase")
    public String deleteCase(Model Model){
        Case = null;
        countTotal();
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/chooseCoolingFan")
    public String chooseCoolingFan(Model Model, @RequestParam("id") int id,HttpSession session){
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        Product product = productRepository.getProductByProductID(id);
        CoolingFan = new Cart(new CartID(user,product),1);
        total += product.getPrice();
        discount += product.getPrice()*(100-product.getSale())/100;
        addList(Model);
        return "BuildPC1";
    }

    @GetMapping("/deleteCoolingFan")
    public String deleteCoolingFan(Model Model) {
        CoolingFan = null;
        countTotal();
        addList(Model);
        return "BuildPC1";
    }
    @GetMapping("/build-pc-view")
    public String view(HttpServletRequest request, Model model, HttpSession session)
    {
        User user = userRepository.findByUserID((int) session.getAttribute("user_id"));
        int pc_id = Integer.parseInt(request.getParameter("pc_id"));
        BuildedPC bPC = pcRepository.findById(pc_id);
        String[] productIdArray = bPC.getProductIds().split(" ");
        List<Product> products = new ArrayList<>();
        for (String id: productIdArray
        ) {
            products.add(productRepository.getProductByProductID(Integer.parseInt(id)));
        }
        for (Product p:products
             ) {
            switch (p.getType()){
                case "CPU":
                    CPU = new Cart(new CartID(user,p),1); break;
                case "Mainboard":
                    Mainboard = new Cart(new CartID(user,p),1); break;
                case "RAM":
                    RAM = new Cart(new CartID(user,p),1); break;
                case "HDD":
                    HDD = new Cart(new CartID(user,p),1); break;
                case "SSD":
                    SSD = new Cart(new CartID(user,p),1); break;
                case "VGA":
                    VGA = new Cart(new CartID(user,p),1); break;
                case "PowerSupply":
                    PowerSupply = new Cart(new CartID(user,p),1); break;
                case "Case":
                    Case = new Cart(new CartID(user,p),1); break;
                case "CoolingFan":
                    CoolingFan = new Cart(new CartID(user,p),1); break;
            }
        }
        for (Product p:products
             ) {
            total+=p.getPrice();
            discount += p.getPrice()*(100-p.getSale())/100;
        }
        addList(model);
        return "BuildPC1";
    }

    @GetMapping("/buildPC/decrement")
    public String decrement(@RequestParam("type") String type, Model model){
        switch (type){
            case "CPU":
                if (CPU.quantity>1) CPU.quantity--; break;
            case "Mainboard":
                if (Mainboard.quantity>1) Mainboard.quantity--; break;
            case "RAM":
                if (RAM.quantity>1) RAM.quantity--; break;
            case "HDD":
                if (HDD.quantity>1) HDD.quantity--; break;
            case "SSD":
                if (SSD.quantity>1) SSD.quantity--; break;
            case "VGA":
                if (VGA.quantity>1) VGA.quantity--; break;
            case "PowerSupply":
                if (PowerSupply.quantity>1) PowerSupply.quantity--; break;
            case "Case":
                if (Case.quantity>1) Case.quantity--; break;
            case "CoolingFan":
                if (CoolingFan.quantity>1) CoolingFan.quantity--; break;
        }
        countTotal();
        addList(model);
        return "BuildPC1";
    }
    @GetMapping("/buildPC/increment")
    public String increment(@RequestParam("type") String type, Model model){
        switch (type){
            case "CPU":
                if (CPU.quantity+1<=CPU.getCartID().getProduct().getQuantity()) CPU.quantity++; break;
            case "Mainboard":
                if (Mainboard.quantity+1<=Mainboard.getCartID().getProduct().getQuantity()) Mainboard.quantity++; break;
            case "RAM":
                if (RAM.quantity+1<=RAM.getCartID().getProduct().getQuantity()) RAM.quantity++; break;
            case "HDD":
                if (HDD.quantity+1<=HDD.getCartID().getProduct().getQuantity()) HDD.quantity++; break;
            case "SSD":
                if (SSD.quantity+1<=SSD.getCartID().getProduct().getQuantity()) SSD.quantity++; break;
            case "VGA":
                if (VGA.quantity+1<=VGA.getCartID().getProduct().getQuantity()) VGA.quantity++; break;
            case "PowerSupply":
                if (PowerSupply.quantity+1<=PowerSupply.getCartID().getProduct().getQuantity()) PowerSupply.quantity++; break;
            case "Case":
                if (Case.quantity+1<=Case.getCartID().getProduct().getQuantity()) Case.quantity++; break;
            case "CoolingFan":
                if (CoolingFan.quantity+1<=CoolingFan.getCartID().getProduct().getQuantity()) CoolingFan.quantity++; break;
        }
        countTotal();
        addList(model);
        return "BuildPC1";
    }

    @PostMapping("/buildPC/order")
    public String order(HttpSession session) {
        List<Cart> carts = new ArrayList<>();
        carts.add(CPU);
        carts.add(Mainboard);
        carts.add(RAM);
        carts.add(HDD);
        carts.add(SSD);
        carts.add(VGA);
        carts.add(PowerSupply);
        carts.add(Case);
        carts.add(CoolingFan);

        // Remove null elements from the list
        carts.removeIf(Objects::isNull);

        for (Cart c : carts) {
            Cart existedCart = cartRepository.findByUserIdAndProductId(c.getCartID().getUser().getUserID(), c.getCartID().getProduct().getProductID());
            if (existedCart != null) {
                cartRepository.delete(existedCart);
            }
            cartRepository.save(c);
        }

        return "redirect:/EcommerceStore/cart/" + session.getAttribute("user_id");
    }


}

