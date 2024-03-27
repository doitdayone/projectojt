package com.example.projectojt.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "OrderDetail")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long orderDetailID;
    private int quantity;

    @JsonBackReference(value = "orderDetail_order")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="orderID")
    private Order order;

    @JsonBackReference(value = "orderDetail_product")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="productID")
    private Product product;

    @OneToOne(mappedBy = "orderDetail")
    private Feedback feedback;
}
