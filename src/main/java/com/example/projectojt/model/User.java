package com.example.projectojt.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int userID;
    private String userName;
    private Date birthday;
    private String email;
    private String password;
//    @JsonManagedReference(value = "cart_user")
//    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
//    private List<Cart> cartList;
    @JsonManagedReference(value = "address_user")
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<Address> addressList;
    @JsonManagedReference(value = "schedule_user")
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<Schedule> scheduleList;


}
