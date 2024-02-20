package com.example.projectojt.model;

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
@Table(name = "Feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long feedbackID;
    private int rating;
    private String description;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "orderDetailID", referencedColumnName = "orderDetailID")
    OrderDetail orderDetail;
}
