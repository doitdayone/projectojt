package com.example.projectojt.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Staff")
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int ID;

    @NotEmpty(message = "Name is required")
    private String name;
    @NotEmpty(message = "Address is required")
    private String address;
    @Pattern(regexp="(^$|[0-9]{10})", message = "Phone number must be 10 digits")
    private String phone;
    @NotNull(message = "Birthday is required")
    @Past(message = "Birthday must be in the past")
    private Date birthday;
    @NotEmpty(message = "Password is required")
    private String password;

    @JsonManagedReference(value = "staff_schedule")
    @OneToMany(mappedBy = "staff", cascade = CascadeType.REMOVE)
    private List<Schedule> schedules;
}
