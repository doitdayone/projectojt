package com.example.projectojt.repository;

import com.example.projectojt.model.Address;
import com.example.projectojt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface AddressRepository extends JpaRepository<Address,Integer> {
    ArrayList<Address> findByUser(User user);
    @Query(value = "SELECT TOP 1 * FROM address ORDER BY addressID DESC", nativeQuery = true)
    Address getNewestAddress();
    Address findById(int id);
}
