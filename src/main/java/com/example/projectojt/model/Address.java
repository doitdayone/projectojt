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
@Table(name = "Address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int addressID;
    private String receiverName;
    private String receiverPhone;
    private String city;
    private String commute;
    private String district;
    private String detail;

    @JsonBackReference(value = "address_user")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="userID")
    private User user;

    @JsonManagedReference(value = "order_address")
    @OneToMany(mappedBy = "address", cascade = CascadeType.REMOVE)
    private List<Order> orderList;

    @Override
    public String toString() {
        return district + ", " + commute + ", " + detail + ", " + city ;
    }
}
