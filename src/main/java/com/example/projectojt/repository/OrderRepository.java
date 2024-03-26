package com.example.projectojt.repository;

import com.example.projectojt.model.Order;
import com.example.projectojt.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    @Query(value = "SELECT orders.* FROM orders JOIN address ON orders.addressId = address.addressId WHERE orders.status = ?2 AND address.userID = ?1", nativeQuery = true)
    ArrayList<Order> findOrdersByUserIdAndStatus(int user_id, String status);

    Order findById(long id);
    ArrayList<Order> findOrdersByStatus(String status);

    @Query(value = "SELECT orders.* FROM orders JOIN address ON orders.addressId = address.addressId WHERE address.userID = ?1", nativeQuery = true)
    ArrayList<Order> findOrdersByUserId(int user_id);
}
