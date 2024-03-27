package com.example.projectojt.repository;

import com.example.projectojt.model.Order;
import com.example.projectojt.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long> {
    List<OrderDetail> findByOrder(Order order);
    OrderDetail findById(long id);
}
