package com.example.projectojt.repository;

import com.example.projectojt.model.Address;
import com.example.projectojt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface AddressRepository extends JpaRepository<Address,Integer> {
    @Query(value = "select * from address where userID = :userID", nativeQuery = true)
    ArrayList<Address> findByUser(@Param("userID") int userID);
    @Query(value = "SELECT * FROM address ORDER BY addressID DESC LIMIT 1", nativeQuery = true)
    Address getNewestAddress();
    Address findById(int id);
}
