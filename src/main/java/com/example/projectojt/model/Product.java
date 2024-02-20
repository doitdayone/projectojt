package com.example.projectojt.model;

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
@Table(name = "Product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int productID;
    private String name;
    private long price;
    private String brand;
    private int quantity;
    private float rating;
    private String image;
    private String detail;
    private String type;
    @JsonManagedReference(value = "orderDetail_product")
    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<OrderDetail> orderDetailList;

//    @JsonManagedReference(value = "cart_product")
//    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
//    private List<Cart> cartList;
}
