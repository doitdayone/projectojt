package com.example.projectojt.controller;
import com.example.projectojt.dto.ProductDTO;
import com.example.projectojt.model.*;
import com.example.projectojt.repository.*;
import com.example.projectojt.service.ProductService;
import com.example.projectojt.service.UserNotFoundException;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import org.springframework.web.multipart.MultipartFile;


import java.io.InputStream;
import java.nio.file.*;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminProductController {
    @Autowired private ProductService service;
    @Autowired private ProductRepository repo;
    @Autowired private OrderRepository repoOrder;
    @Autowired private OrderDetailRepository repoOrderDetail;
    @Autowired private ScheduleRepository repoSche;
    @Autowired private FeedbackRepository repoFeed;

    @GetMapping("/manageProduct")
    public String showProductList(Model model, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        List<Product> listProducts = service.listAll();
        model.addAttribute("listProducts", listProducts);

        return "manageProduct";
    }

    @GetMapping("/create")
    public String showCreateProduct(Model Model, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        Model.addAttribute("productDto", new ProductDTO());
        return "createProduct";
    }

    @GetMapping("/confirm")
    public String showConfirmProduct(Model model, HttpSession session) {
        if ((boolean) session.getAttribute("admin") != true)
            return "error";

        List<Order> listOrders = repoOrder.findAll(); // Fetch all orders
        model.addAttribute("listOrders", listOrders);

        return "confirmOrder";
    }

    @PostMapping("/confirmOrder")
    public String confirmOrder(@RequestParam("id") Long orderId) {
        // Retrieve the order from the database based on orderId
        Order order = repoOrder.findById(orderId).orElse(null);
        if (order != null) {
            // Update the status to CONFIRM
            order.setStatus("CONFIRM");
            repoOrder.save(order); // Save the updated order
        }
        return "redirect:/admin/confirm"; // Redirect back to the confirm page
    }

    @PostMapping("/confirmPendingOrder")
    public String confirmPendingOrder(@RequestParam("id") Long orderId) {
        // Retrieve the order from the database based on orderId
        Order order = repoOrder.findById(orderId).orElse(null);
        if (order != null) {
            // Update the status to CONFIRM
            order.setPStatus("PAID");
            repoOrder.save(order); // Save the updated order
        }
        return "redirect:/admin/confirm"; // Redirect back to the confirm page
    }

    @GetMapping("/orderDetail")
    public String showOrderDetail(Model Model, @RequestParam long id, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        List<OrderDetail> orderDetail = repoOrderDetail.findByOrder(repoOrder.findById(id));
        Model.addAttribute("orderDetail", orderDetail);
        return "OrderDetail";
    }

    @GetMapping("/confirmSchedule")
    public String showConfirmSchedule(Model model, HttpSession session) {
        if ((boolean) session.getAttribute("admin") != true)
            return "error";

        List<Schedule> listSchedules = repoSche.findAll(); // Fetch all orders
        model.addAttribute("listSchedules", listSchedules);

        return "confirmSchedule";
    }

    @GetMapping("/manageFeedback")
    public String showManageFeedback(Model model, HttpSession session) {
        if ((boolean) session.getAttribute("admin") != true)
            return "error";

        List<Feedback> listFeedbacks = repoFeed.findAll(); // Fetch all orders
        model.addAttribute("listFeedbacks", listFeedbacks);

        return "manageFeedback";
    }

    @PostMapping("/manageFeedback/response/{feedbackID}")
    public String updateFeedback(@PathVariable("feedbackID") int feedbackID,  @RequestParam("response") String response, HttpSession session) {

        if ((boolean) session.getAttribute("admin") != true)
            return "error";

        Feedback feedback = repoFeed.getFeedbackByFeedbackID(feedbackID);
        feedback.setResponse(response);
        repoFeed.save(feedback); // Lưu phản hồi cập nhật vào cơ sở dữ liệu
        return "redirect:/admin/manageFeedback"; // Chuyển hướng sau khi cập nhật
    }


    @PostMapping("/create/add")
    public String addProduct(@Valid @ModelAttribute ProductDTO productDto, BindingResult result, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";

        if (productDto.getImages().isEmpty()){
            result.addError(new FieldError("productDto", "image", "The image file is required"));
        }

        if (result.hasErrors()){
            return "createProduct";
        }

        MultipartFile image = productDto.getImages();
        Date createAt = new Date();
        String storageFileName = createAt.getTime() + "_" + image.getOriginalFilename();
        try {
            String uploadDir = "public/images/";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);
            }

            try(InputStream inputStream = image.getInputStream()){
                Files.copy(inputStream, Paths.get(uploadDir + storageFileName), StandardCopyOption.REPLACE_EXISTING);
            }
        }
        catch (Exception ex){
            System.out.println("Exception" + ex.getMessage());
        }

        Product product = new Product();
        product.setName(productDto.getName());
        product.setBrand(productDto.getBrand());
        product.setType(productDto.getType());
        product.setPrice(productDto.getPrice());
        product.setSale(productDto.getSale());
        product.setDetail(productDto.getDetail());
        product.setImages(storageFileName);
        product.setQuantity(productDto.getQuantity());
        product.setSale(productDto.getSale());
        service.save(product);


        return "redirect:/admin/manageProduct";
    }
    @GetMapping("/edit")
    public String showEditPage(Model Model, @RequestParam int id, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";

        try {
            Product product = repo.findById(id).get();
            Model.addAttribute("product", product);

            ProductDTO productDto = new ProductDTO();
            productDto.setName(product.getName());
            productDto.setBrand(product.getBrand());
            productDto.setType(product.getType());
            productDto.setPrice(product.getPrice());
            productDto.setSale(product.getSale());
            productDto.setQuantity(product.getQuantity());
            productDto.setDetail(product.getDetail());

            Model.addAttribute("productDto", productDto);
        }
        catch (Exception ex){
            System.out.println("Exception: " + ex.getMessage());
            return "redirect:/admin/manageProduct";
        }

        return "editProduct";
    }

    @PostMapping("/edit")
    public String updateProduct(
            Model Model,
            @RequestParam int id,
            @Valid @ModelAttribute ProductDTO productDto,
            BindingResult result
            , HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        try {
            Product product = service.get(id);
            Model.addAttribute("product", product);

            if (result.hasErrors()){
                return "editProduct";
            }

            if (!productDto.getImages().isEmpty()){
                String uploadDir = "public/images/";
                Path oldImagePath = Paths.get(uploadDir + product.getImages());

                try {
                    Files.delete(oldImagePath);
                }
                catch (Exception ex){
                    System.out.println("Exception: " + ex.getMessage());
                }

                MultipartFile image = productDto.getImages();
                Date createAt = new Date();
                String storageFileName = createAt.getTime() + "_" + image.getOriginalFilename();
                try(InputStream inputStream = image.getInputStream()){
                    Files.copy(inputStream, Paths.get(uploadDir + storageFileName), StandardCopyOption.REPLACE_EXISTING);
                }
                product.setImages(storageFileName);
            }

            product.setName(productDto.getName());
            product.setBrand(productDto.getBrand());
            product.setType(productDto.getType());
            product.setPrice(productDto.getPrice());
            product.setSale(productDto.getSale());
            product.setDetail(productDto.getDetail());
            product.setQuantity(productDto.getQuantity());
            System.err.println("XXXXXXXXX");
            service.save(product);
        }
        catch (Exception ex){
            System.out.println("Exception: " + ex.getMessage());
        } catch (UserNotFoundException e) {
            throw new RuntimeException(e);
        }
        return "redirect:/admin/manageProduct";
    }

    @Transactional
    @GetMapping("/delete")
    public String deleteProduct(
            @RequestParam int id
            , HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        try {

            Product product = service.get(id);

            Path imagePath = Paths.get("public/images/" + product.getImages());

            try {
                Files.delete(imagePath);
            } catch (Exception ex) {
                System.out.println("Exception: " + ex.getMessage());
            }

            service.delete(id);
        }catch (UserNotFoundException ex) {
            System.out.println("Exception: " + ex.getMessage());
        }

        return "redirect:/admin/manageProduct";
    }
}
