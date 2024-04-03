package com.example.projectojt.repository;

import com.example.projectojt.model.BuildedPC;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildedPCRepository extends JpaRepository<BuildedPC,Integer> {
    public BuildedPC findById(int id);
}
