package com.example.projectojt.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;
import java.util.Objects;

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

    private String status;
    private Date order_date;
    //payment status
    private String pStatus;

    @JsonManagedReference(value = "orderDetail_order")
    @OneToMany(mappedBy = "order", cascade = CascadeType.REMOVE)
    private List<OrderDetail> orderDetailList;

    @JsonBackReference(value = "order_address")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="addressID")
    private Address address;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Order order)) return false;
        return getOrderID() == order.getOrderID();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getOrderID());
    }
}
