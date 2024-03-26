package com.example.projectojt.service;

import com.example.projectojt.model.Schedule;
import com.example.projectojt.model.Staff;
import com.example.projectojt.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {
@Autowired
private StaffRepository staffRepository;
//  @Override
//  public boolean getAvailableTime( String time, List<Schedule> scheduleList) {
//    // count variable represent for num of user booking that time in a day
//    List<Staff> productStaffs = staffRepository.findAll();
//    int count=0;
//    for(Schedule schedule: scheduleList)
//    {
//      if( (schedule.getTime().trim()).equalsIgnoreCase(time.trim()))
//      {
//        count++;
//      }
//    }
//    if(count < productStaffs.size())
//    {
//      return true;
//    } else
//    {
//      return false;
//    }
//
//  }
}
