package com.example.projectojt.service;

import com.example.projectojt.model.Order;
import com.example.projectojt.model.OrderDetail;
import com.example.projectojt.model.Product;
import com.example.projectojt.model.User;
import com.example.projectojt.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FeedbackRepository feedbackRepository;


    public List<Product> listAll() {
        return (List<Product>) repo.findAll(Sort.by(Sort.Direction.DESC, "productID"));
    }

    public void save(Product product) {
        repo.save(product);
    }

    public Product get(int id) throws UserNotFoundException {
        Optional<Product> result = repo.findById(id);
        if (result.isPresent()) {
            return result.get();
        }
        throw new UserNotFoundException("Could not find any product with ID" + id);
    }

    @Transactional
    public void delete(int id) throws UserNotFoundException {
        Optional<Product> result = repo.findById(id);
        if (result.isPresent()) {
            repo.deleteById(id);
        }
        throw new UserNotFoundException("Could not find any product with ID" + id);
    }

    public List<Product> getInitialProducts() {
        return repo.findAll(PageRequest.of(0, 4)).getContent();
    }

    public List<Product> getMoreProducts(int page, int size) {
        return repo.findAll(PageRequest.of(page, size)).getContent();
    }

    public List<Product> searchProduct(String keyword) {
        // Perform the search using pagination
        Page<Product> searchPage = repo.searchProducts(keyword,
                PageRequest.of(0, 4));

        // Retrieve the content of the first page

        return searchPage.getContent();
    }

    public List<Product> getMoreSearchProduct(String keyword, int page, int size) {
        // Perform the search using pagination
        Page<Product> searchPage = repo.searchProducts(keyword,
                PageRequest.of(page, size));

        // Retrieve the content of the first page

        return searchPage.getContent();
    }

    public List<OrderDetail> getAllUserBoughtByUserId(int userId) {
        try {
            List<Order> orderList = orderRepository.findOrdersByUserId(userId);
            List<OrderDetail> orderDetailList = new ArrayList<>();
            for (Order order : orderList) {
                System.err.println(order.getOrderID());
                for (OrderDetail od : order.getOrderDetailList()) {
                    System.err.println(od.getProduct().getName() + " od");
                    orderDetailList.add(od);
                }
            }
            return orderDetailList;
        } catch (Exception e) {
            System.err.println("XXXXXXXXXXXXXXx");
            e.printStackTrace();
            return null;
        }
    }
    public void setRating(Product product){
        product.setRating(feedbackRepository.sumRatingByProductId(product.getProductID()) / feedbackRepository.countByProductId(product.getProductID()));
        repo.save(product);
    }

    public List<Product> getProductsByBrand(String brand) {
        // Đây chỉ là một ví dụ, bạn cần thay thế bằng logic để lấy danh sách sản phẩm từ cơ sở dữ liệu hoặc từ nơi khác
        // Giả sử danh sách sản phẩm đã được lấy từ cơ sở dữ liệu trước
        List<Product> productLists = repo.findByBrand(brand);
        return productLists;
    }
}
