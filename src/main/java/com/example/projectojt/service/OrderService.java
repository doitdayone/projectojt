package com.example.projectojt.service;

import com.example.projectojt.model.Order;
import com.example.projectojt.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getInitOrder(int user_id, String status) {
        Page<Order> searchPage = getOrders(orderRepository.findOrdersByUserIdAndStatus(user_id,status),0,4);
        return searchPage.getContent();
    }

    public List<Order> getMoreOrder(String status, int user_id, int page, int size) {
        // Perform the search using pagination
        Page<Order> searchPage = getOrders(orderRepository.findOrdersByUserIdAndStatus(user_id,status),page,size);

        return searchPage.getContent();
    }
    public Page<Order> getOrders(List<Order> allOrders,int page, int size) {

        Pageable pageRequest = createPageRequestUsing(page, size);
        int start = (int) pageRequest.getOffset();
        int end = Math.min((start + pageRequest.getPageSize()), allOrders.size());

        List<Order> pageContent = allOrders.subList(start, end);
        return new PageImpl<>(pageContent, pageRequest, allOrders.size());
    }
    private Pageable createPageRequestUsing(int page, int size) {
        return PageRequest.of(page, size);
    }
}
