package com.example.projectojt.service;

import com.example.projectojt.model.Schedule;
import com.example.projectojt.model.Staff;
import com.example.projectojt.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@Service
public class ScheduleService {
    @Autowired
    private StaffRepository staffRepository;

    // chon staff thuc  hien schedule dua tren so ngay lam viec it hon
    public Staff scheduling(Date date, int shift) {
        List<Staff> allStaffs = staffRepository.findAll();
        List<Staff> freeStaffs = new ArrayList<>();
        for (Staff staff : allStaffs
        ) {
            int countBusy = 0;
            for (Schedule sche : staff.getSchedules()
            ) {
                if (sche.getTime().equals(date) && sche.getShift() == shift)
                    countBusy++;
            }
            if (countBusy == 0) freeStaffs.add(staff);
        }

        if (freeStaffs.isEmpty()) return null;

        HashMap<Staff, Integer> rankShift = new HashMap<>();
        for (Staff staff : freeStaffs
        ) {

            int workDays = 0;
            for (Schedule sche : staff.getSchedules()
            ) {
                Calendar calStaff = Calendar.getInstance();
                calStaff.setTime(sche.getTime());

                Calendar cal = Calendar.getInstance();
                cal.setTime(date);

                if (calStaff.get(Calendar.YEAR) == cal.get(Calendar.YEAR))
                    if (calStaff.get(Calendar.MONTH) == cal.get(Calendar.MONTH))
                        workDays++;
            }

            rankShift.put(staff, workDays);
        }

        Staff[] array = freeStaffs.toArray(new Staff[freeStaffs.size()]);

        int i, j;
        Staff temp;
        boolean swapped;
        for (i = 0; i < array.length; i++) {
            swapped = false;
            for (j = 0; j < array.length - i - 1; j++) {
                if (rankShift.get(array[j]) > rankShift.get(array[j + 1])) {
                    temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    swapped = true;
                }
            }
            // If no two elements were swapped
            // by inner loop, then break
            if (swapped == false)
                break;
        }

        return array[0];
    }
}
