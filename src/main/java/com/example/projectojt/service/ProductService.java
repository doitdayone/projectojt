package com.example.projectojt.service;

import com.example.projectojt.model.Product;
import com.example.projectojt.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired private ProductRepository repo;

    public List<Product> listAll() {
        return (List<Product>) repo.findAll(Sort.by(Sort.Direction.DESC,"productID"));
    }

    public void save(Product product){
        repo.save(product);
    }

    public Product get(Integer id) throws UserNotFoundException {
        Optional<Product> result = repo.findById(id);
        if (result.isPresent()){
            return result.get();
        }
        throw new UserNotFoundException("Could not find any product with ID" + id);
    }
}
