package com.example.projectojt.controller;


import com.example.projectojt.model.*;
import com.example.projectojt.repository.*;
import com.example.projectojt.service.ProductService;
import com.example.projectojt.service.ScheduleService;
import com.example.projectojt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public String showScheduleForm(Model model, Authentication authentication,
                                   HttpSession session) {
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails userDetails) {
                // Standard UserDetails case
                String email = userDetails.getUsername();
                model.addAttribute("user_email", email);
                User user = userRepository.findByEmail(email);
                model.addAttribute("userRepository", userRepository);
                int userid = user.getUserID();
                model.addAttribute("user_id", userid);
                session.setAttribute("user_id", userRepository.findByEmail(email).getUserID());
                if (user.getRoles().equals("ADMIN"))
                    return "redirect:/admin";
            } else if (principal instanceof OAuth2User oAuth2User) {
                // get user_email when sign in with google or facebook
                Map<String, Object> attributes = oAuth2User.getAttributes();
                model.addAttribute("user_email",
                        attributes.get("email"));

                if(!userRepository.existsByEmail((String) attributes.get("email"))){
                    var user =  User.builder().userName((String) attributes.get("name"))
                            .email((String) attributes.get("email")).password("").verified(true).roles("USER").build();
                    userRepository.save(user);
                    ;
                }
                session.setAttribute("user_id", userRepository.findByEmail((String) attributes.get("email")).getUserID());
                model.addAttribute("userRepository", userRepository);

            } else {
                return "error";
            }
        }

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
        return "booking-success"; // Trả về URL của trang thành công
    }
}
