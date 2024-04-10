package com.example.projectojt.controller;

import com.example.projectojt.config.VNPayService;
import com.example.projectojt.model.*;
import com.example.projectojt.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.sql.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Controller
@RequestMapping("/EcommerceStore")
public class OrderController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressRepository userAddressRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private VNPayService vnPayService;

    @GetMapping("/order")
    public String viewOrder(@RequestParam("user_id") int user_id,
                            @RequestParam("total") int total, Model model) {
        if (total == 0) {
            model.addAttribute("error", "Your cart is empty");
            return "order_error";
        } else {
            List<Address> userAddressList = userAddressRepository.findByUser(user_id);
            model.addAttribute("userAddressList", userAddressList);
            model.addAttribute("total", total);
            model.addAttribute("user_id", user_id);
            return "order1";

        }

    }

    @PostMapping("/order")
    public String confirmOrder(@RequestParam("user_id") int user_id,
                               @RequestParam("useraddress") int address_id,
                               @RequestParam("payment_method") int payment_method, @RequestParam("total") int total,
                               HttpSession session, Model model, @RequestParam("address") int address,
                               @RequestParam("district") String district, @RequestParam("commute") String commute,
                               @RequestParam("detail_address") String detail_address, @RequestParam("city") String city,
                               @RequestParam("receive_name") String receive_name,
                               @RequestParam("receive_phone") String receive_phone) {

        int user_address;
        if (address == 1 && address_id!=-1) {
            user_address = address_id;
        } else {
            Address userAddress = new Address();
            userAddress.setUser(userRepository.findByUserID(user_id));
            userAddress.setCity(city);
            userAddress.setDetail(detail_address);
            userAddress.setDistrict(district);
            userAddress.setCommute(commute);
            userAddress.setReceiverPhone(receive_phone);
            userAddress.setReceiverName(receive_name);
            userAddressRepository.save(userAddress);
            Address userAddress1 = userAddressRepository.getNewestAddress();
            user_address = userAddress1.getAddressID();
        }

        if (payment_method == 1) {

            String status = "PENDING";
            String pStatus = "NOT YET";
            LocalDateTime now = LocalDateTime.now();
            Date orderDate = Date.valueOf(now.toLocalDate());

            Order order = new Order();
            order.setOrder_date(orderDate);
            order.setStatus(status);
            order.setPStatus(pStatus);
            order.setCost(total);
            order.setAddress(userAddressRepository.findById(user_address));

            orderRepository.save(order);
            List<Cart> cartItemList = (List<Cart>) session.getAttribute("cartItemList");
            for (Cart cartItem : cartItemList) {
                OrderDetail orderDetail = new OrderDetail();
                Product product = cartItem.getCartID().getProduct();

                product.setQuantity(product.getQuantity() - cartItem.getQuantity());
                orderDetail.setOrder(order);
                orderDetail.setProduct(cartItem.getCartID().getProduct());
                orderDetail.setQuantity(cartItem.getQuantity());

                productRepository.save(product);
                orderDetailRepository.save(orderDetail);
                cartRepository.delete(cartItem);


            }

            session.removeAttribute("cart");
            session.removeAttribute("cartItemList");
            return "success";
        } else {

            String status = "PAID";

            LocalDateTime now = LocalDateTime.now();
            Date orderDate = Date.valueOf(now.toLocalDate());
            session.setAttribute("address_id", address_id);
            session.setAttribute("total", total);
            session.setAttribute("status", status);
            session.setAttribute("user_id", user_id);
            session.setAttribute("orderDate", orderDate);
//      Order order = new Order(address_id, total, status, user_id, orderDate);
//      orderRepository.save(order);
//      List<CartItem> cartItemList = (List<CartItem>) session.getAttribute("cartItemList");
//      for (CartItem cartItem : cartItemList) {
//        OrderDetail orderDetail = new OrderDetail();
//        orderDetail.setOrder(order);
//        orderDetail.setProduct_id(cartItem.getProductId());
//        orderDetail.setQuantity(cartItem.getQuantity());
//        orderDetail.setProduct_name(
//            productRepository.getProductByProductId(cartItem.getProductId()).getProduct_name());
//        orderDetail.setImage(
//            productRepository.getProductByProductId(cartItem.getProductId()).getProduct_image());
//        orderDetailRepository.save(orderDetail);
//        cartItemRepository.delete(cartItem);
//      }
            model.addAttribute("total", total);
//      session.removeAttribute("cart");
//      session.removeAttribute("cartItemList");
//      cartRepository.delete(cart);
            return "vnpay";
        }

    }

    @PostMapping("/submitOrder")
    public String submidOrder(@RequestParam("amount") int orderTotal,
                              @RequestParam("orderInfo") String orderInfo,
                              HttpServletRequest request) {
        String baseUrl =
                request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        return "redirect:" + vnpayUrl;
    }

    @GetMapping("/vnpay-payment")
    public String GetMapping(HttpServletRequest request, Model model, HttpSession session) {
        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);
        if (paymentStatus == 1) {

            int address_id = (int) session.getAttribute("address_id");
            int total = (int) session.getAttribute("total");
            int user_id = (int) session.getAttribute("user_id");
            Date orderDate = (Date) session.getAttribute("orderDate");
            String pStatus = "PAID";
            String status = "PENDING";
            Order order = new Order();
            order.setOrder_date(orderDate);
            order.setStatus(status);
            order.setPStatus(pStatus);
            order.setCost(total);
            order.setAddress(userAddressRepository.findById(address_id));

            orderRepository.save(order);
            List<Cart> cartItemList = (List<Cart>) session.getAttribute("cartItemList");
            for (Cart cartItem : cartItemList) {
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrder(order);
                orderDetail.setProduct(cartItem.getCartID().getProduct());
                orderDetail.setQuantity(cartItem.getQuantity());

                orderDetailRepository.save(orderDetail);
                cartRepository.delete(cartItem);
            }
            model.addAttribute("total", total);
            session.removeAttribute("cart");
            session.removeAttribute("cartItemList");

            return "order_success";
        } else {
            return "order_fail";
        }

    }
}