package com.example.projectojt.repository;

import com.example.projectojt.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public  interface ScheduleRepository extends JpaRepository<Schedule,Integer> {

}
