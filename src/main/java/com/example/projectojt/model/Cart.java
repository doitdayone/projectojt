package com.example.projectojt.model;

import com.example.projectojt.Key.CartID;
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
@Table(name = "Cart")
public class Cart {
    @EmbeddedId
    private CartID cartID;
    public int quantity;
}
