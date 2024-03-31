package com.example.projectojt.repository;

import com.example.projectojt.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
    @Query("SELECT f FROM Feedback f WHERE f.product.productID = :productId")
    List<Feedback> findAllByProductId(int productId);
}
