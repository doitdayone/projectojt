package com.example.projectojt.Key;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.example.projectojt.model.Product;
import com.example.projectojt.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartID implements Serializable {
    @JsonBackReference(value = "cart_user")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="userID")
    private User user;
    @JsonBackReference(value = "cart_product")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="productID")
    private Product product;
}
