package com.example.projectojt.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long orderID;
    private float cost;

    @JsonManagedReference(value = "orderDetail_order")
    @OneToMany(mappedBy = "order", cascade = CascadeType.REMOVE)
    private List<OrderDetail> orderDetailList;

    @JsonBackReference(value = "order_address")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="addressID")
    private Address address;
}
