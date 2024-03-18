package com.example.projectojt.repository;

import com.example.projectojt.Key.CartID;
import com.example.projectojt.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, CartID> {
    @Query(value = "select * from cart where userID = :user_id", nativeQuery = true)
    ArrayList<Cart> findCartsByUserID(@Param("user_id") int user_id);
}
