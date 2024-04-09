package com.example.projectojt.controller;


import com.example.projectojt.model.*;
import com.example.projectojt.repository.*;
import com.example.projectojt.service.ProductService;
import com.example.projectojt.service.ScheduleService;
import com.example.projectojt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/EcommerceStore/clean-booking")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ProductService productService;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  ScheduleService service;
    @GetMapping("/booking")
    public String showScheduleForm(Model model, HttpSession session) {

        int userId = (int) session.getAttribute("user_id");
        // Lấy danh sách sản phẩm để hiển thị trong dropdown
        List<OrderDetail> orderDetails = productService.getAllUserBoughtByUserId(userId);
        model.addAttribute("orderDetails", orderDetails);
        // Tạo một đối tượng Schedule để binding với form
        model.addAttribute("schedule", new Schedule());

        List<Address> addresses = new ArrayList<>();
        for (Address a : addressRepository.findByUser(userId)) {
            if (a.getCity().equals("Thành phố Đà Nẵng"))
                addresses.add(a);
        }
        model.addAttribute("addresses", addresses);
        return "schedule"; // Trả về tên của trang HTML (schedule-form.html)
    }

    // Phương thức POST để xử lý yêu cầu đặt lịch
    @PostMapping("/booking")
    public String processScheduleForm(@RequestParam("orderDetail") long orderDetailId,
                                      @RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date date,
                                      @RequestParam("phone") String phone,
                                      @RequestParam("name") String name,
                                      @RequestParam("shift") int shift,
                                      @RequestParam("address") int addressId,
                                      HttpSession session,
                                      Model model) {
        // Lấy chi tiết đơn hàng từ ID được chọn trong dropdown
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId);
        java.sql.Date sqlDate = new java.sql.Date(date.getTime());

        // Tạo một đối tượng lịch mới
        Schedule schedule = new Schedule();
        schedule.setOrderDetail(orderDetail);
        schedule.setTime(sqlDate); // Thời gian lịch được chọn
        schedule.setStatus("PROCESSING");
        schedule.setPhone(phone);
        schedule.setName(name);
        schedule.setShift(shift);
        schedule.setUser(userRepository.findByUserID((int) session.getAttribute("user_id")));
        // Lấy địa chỉ từ ID được chọn trong dropdown
        Address address = addressRepository.findById(addressId);
        schedule.setAddress(address);
        Staff staff = service.scheduling(sqlDate, shift);
        if (staff==null){
            model.addAttribute("error","Dich vu dang qua tai");
            return "error";
        }
        schedule.setStaff(staff);
        // Lưu lịch vào cơ sở dữ liệu
        scheduleRepository.save(schedule);
        // Chuyển hướng người dùng đến trang thành công hoặc trang khác
        return "redirect:/success"; // Trả về URL của trang thành công
    }
}
