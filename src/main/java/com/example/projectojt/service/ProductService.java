package com.example.projectojt.service;

import com.example.projectojt.model.Product;
import com.example.projectojt.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired private ProductRepository repo;

    public List<Product> listAll() {
        return (List<Product>) repo.findAll(Sort.by(Sort.Direction.DESC,"productID"));
    }
}
