package com.example.projectojt.controller;


import com.example.projectojt.model.OrderDetail;
import com.example.projectojt.model.Product;
import com.example.projectojt.model.Schedule;
import com.example.projectojt.repository.*;
import com.example.projectojt.service.ProductService;
import com.example.projectojt.service.ScheduleService;
import com.example.projectojt.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/EcommerceStore/clean-booking")
public class ScheduleController {

  @Autowired
  private ScheduleRepository scheduleRepository;

  @Autowired
  private ProductService productService;

@Autowired
private UserService userService;
  @GetMapping("/booking")
  public String showScheduleForm(Model model, HttpSession session) {

    int userId = (int) session.getAttribute("user_id");
    // Lấy danh sách sản phẩm để hiển thị trong dropdown
    List<OrderDetail> orderDetails = productService.getAllUserBoughtByUserId(userId);
    model.addAttribute("orderDetails", orderDetails);
    // Tạo một đối tượng Schedule để binding với form
    model.addAttribute("schedule", new Schedule());
    return "schedule"; // Trả về tên của trang HTML (schedule-form.html)
  }

  // Phương thức POST để xử lý yêu cầu đặt lịch
  @PostMapping("/booking")
  public String processScheduleForm(@ModelAttribute("schedule") Schedule schedule) {
    // Thực hiện xử lý đặt lịch ở đây, ví dụ: lưu lịch vào cơ sở dữ liệu
    scheduleRepository.save(schedule);
    // Chuyển hướng người dùng đến trang thành công hoặc trang khác
    return "redirect:/success"; // Trả về URL của trang thành công
  }
}
