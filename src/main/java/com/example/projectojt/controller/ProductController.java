package com.example.projectojt.controller;


import com.example.projectojt.dto.ProductDTO;
import com.example.projectojt.model.Product;
import com.example.projectojt.repository.ProductRepository;
import com.example.projectojt.service.ProductService;
import org.hibernate.query.SortDirection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;

import java.util.Date;
import java.util.List;

@Controller
public class ProductController {
    @Autowired private ProductService service;
    @Autowired private ProductRepository repo;

    @GetMapping("/manageProduct")
    public String showProductList(Model model){
        List<Product> listProducts = service.listAll();
        model.addAttribute("listProducts", listProducts);

        return "manageProduct";
    }
    @GetMapping("/create")
    public String showCreateProduct(Model Model){
        Model.addAttribute("productDto", new ProductDTO());
        return "createProduct";
    }

    @PostMapping("/create/add")
    public String addProduct(@Valid @ModelAttribute ProductDTO productDto, BindingResult result){

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
        product.setDetail(productDto.getDetail());
        product.setImage(storageFileName);
        product.setQuantity(productDto.getQuantity());

        service.save(product);


        return "redirect:/manageProduct";
    }

    @GetMapping("/edit")
    public String showEditPage(Model Model, @RequestParam int id){

        try {
            Product product = repo.findById(id).get();
            Model.addAttribute("product", product);

            ProductDTO productDto = new ProductDTO();
            productDto.setName(product.getName());
            productDto.setBrand(product.getBrand());
            productDto.setType(product.getType());
            productDto.setPrice(product.getPrice());
            productDto.setQuantity(product.getQuantity());
            productDto.setDetail(product.getDetail());

            Model.addAttribute("productDto", productDto);
        }
        catch (Exception ex){
            System.out.println("Exception: " + ex.getMessage());
            return "redirect:/manageProduct";
        }

        return "editProduct";
    }

    @PostMapping("/update")
    public String updateProduct(
            Model Model,
            @RequestParam int id,
            @Valid @ModelAttribute ProductDTO productDto,
            BindingResult result
    ){
        try {
            Product product = repo.findById(id).get();
            Model.addAttribute("product", product);

            if (result.hasErrors()){
                return "editProduct";
            }

            if (!productDto.getImages().isEmpty()){
                String uploadDir = "public/images/";
                Path oldImagePath = Paths.get(uploadDir + product.getImage());

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
                product.setImage(storageFileName);
            }

            product.setName(productDto.getName());
            product.setBrand(productDto.getBrand());
            product.setType(productDto.getType());
            product.setPrice(productDto.getPrice());
            product.setDetail(productDto.getDetail());
            product.setQuantity(productDto.getQuantity());

            repo.save(product);
        }
        catch (Exception ex){
            System.out.println("Exception: " + ex.getMessage());
        }
        return "redirect:/manageProduct";
    }

    @GetMapping("/delete")
    public String deleteProduct(
            @RequestParam int id
    ){
        try {

            Product product = repo.findById(id).get();

            Path imagePath = Paths.get("public/images/" + product.getImage());

            try {
                Files.delete(imagePath);
            } catch (Exception ex) {
                System.out.println("Exception: " + ex.getMessage());
            }

            repo.delete(product);
        }catch (Exception ex) {
            System.out.println("Exception: " + ex.getMessage());
        }

        return "manageProduct";
    }
}
