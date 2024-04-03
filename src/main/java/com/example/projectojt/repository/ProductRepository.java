package com.example.projectojt.repository;

import com.example.projectojt.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findProductsByType(String type);
    List<Product> findProductsByBrand(String brand);
    List<Product> findProductsByPriceBetweenAndType(int start_price, int end_price, String type);

    @Query("select p from Product p where p.name LIKE CONCAT('%', ?1, '%')")
    List<Product> searchProduct(String keyword);

    @Query("select p from Product p where p.name LIKE CONCAT('%', ?1, '%')")
    Page<Product> searchProducts(String keyword, PageRequest of);

    List<Product> findByBrand(String brand);

    Product getProductByProductID(int id);
    @Query("SELECT DISTINCT p FROM Product p JOIN p.orderDetailList od JOIN od.order o JOIN o.address.user u WHERE u.userID = :userId AND p NOT IN (SELECT DISTINCT f.product FROM Feedback f WHERE f.user.userID = :userId)")
    List<Product> findProductsToFeedbackByUser(@Param("userId") int userId);
}
