package com.example.projectojt.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int userID;
    private String userName;
    private Timestamp birthday;
    private String email;
    private String password;
    private String phone;
//    @JsonManagedReference(value = "cart_user")
//    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
//    private List<Cart> cartList;
    @JsonManagedReference(value = "address_user")
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<Address> addressList;
    @JsonManagedReference(value = "schedule_user")
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<Schedule> scheduleList;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Feedback> feedbacks;

    private String roles;
    private String otp;
    private LocalDateTime otpGeneratedTime;
    @Column(name = "is_active", columnDefinition = "BIT")
    private boolean verified;

}
