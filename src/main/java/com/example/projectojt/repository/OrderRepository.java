package com.example.projectojt.repository;

import com.example.projectojt.model.Order;
import com.example.projectojt.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    @Query(value = "SELECT orders.* FROM orders JOIN address ON orders.addressId = address.addressId WHERE orders.status = ?1 AND address.userID = ?2", nativeQuery = true)
    ArrayList<Order> findOrdersByUserIdAndStatus(int user_id, String status);

    Order findById(long id);
}
