package com.example.projectojt.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Objects;

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

    @JsonManagedReference(value = "address_schedule")
    @OneToMany(mappedBy = "address", cascade = CascadeType.REMOVE)
    private List<Schedule> schedules;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Address address)) return false;
        return getAddressID() == address.getAddressID() && Objects.equals(getReceiverName(), address.getReceiverName()) && Objects.equals(getReceiverPhone(), address.getReceiverPhone()) && Objects.equals(getCity(), address.getCity()) && Objects.equals(getCommute(), address.getCommute()) && Objects.equals(getDistrict(), address.getDistrict()) && Objects.equals(getUser(), address.getUser());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getAddressID(), getReceiverName(), getReceiverPhone(), getCity(), getCommute(), getDistrict(), getUser());
    }

    @Override
    public String toString() {
        return district + ", " + commute + ", " + detail + ", " + city ;
    }
    public String getCusInfo()
    {
        return receiverName+", "+ receiverPhone;
    }
}
