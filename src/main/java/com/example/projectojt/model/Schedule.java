package com.example.projectojt.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int ID;
    private Date time;
    private String status;
    private String phone;
    private String name;

    @JsonBackReference(value = "schedule_user")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="userID")
    private User user;
}
