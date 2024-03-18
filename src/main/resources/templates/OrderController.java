package com.example.EcommerceStore.controller;

import com.example.EcommerceStore.config.VNPayService;
import com.example.EcommerceStore.entity.*;
import com.example.EcommerceStore.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/EcommerceStore")
public class OrderController {

  @Autowired
  private UserAddressRepository userAddressRepository;
  @Autowired
  private OrderRepository orderRepository;
  @Autowired
  private ProductRepository productRepository;
  @Autowired
  private OrderDetailRepository orderDetailRepository;
  @Autowired
  private CartItemRepository cartItemRepository;
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
      List<UserAddress> userAddressList = userAddressRepository.findUserAddressesByUserId(user_id);
      model.addAttribute("userAddressList", userAddressList);
      model.addAttribute("total", total);
      model.addAttribute("user_id", user_id);
      return "order";

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
    Cart cart = cartRepository.findCartByUserId(user_id);
    int user_address;
    if (address == 1) {
      user_address = address_id;
    } else {
      UserAddress userAddress = new UserAddress(district, commute, detail_address, city,
          receive_name, receive_phone, user_id);
      userAddressRepository.save(userAddress);
      UserAddress userAddress1 = userAddressRepository.getUserAddress();
      user_address = userAddress1.getAddressId();
    }

    if (payment_method == 1) {

      String status = "PENDING";
      String pStatus = "NOT YET";
      LocalDateTime now = LocalDateTime.now();
      Date orderDate = Date.valueOf(now.toLocalDate());

      Order order = new Order(user_address, total, status, pStatus, user_id, orderDate);

      orderRepository.save(order);
      List<CartItem> cartItemList = (List<CartItem>) session.getAttribute("cartItemList");
      for (CartItem cartItem : cartItemList) {
        OrderDetail orderDetail = new OrderDetail();
        Product product = productRepository.getProductByProductId(cartItem.getProductId());
//        System.out.println("Product ID: " + product.getProductId());
//        System.out.println("cart item quantity: " + cartItem.getQuantity());
        product.setProduct_quantity(product.getProduct_quantity() - cartItem.getQuantity());
        orderDetail.setOrder(order);
        orderDetail.setProduct_id(cartItem.getProductId());
        orderDetail.setQuantity(cartItem.getQuantity());
        orderDetail.setProduct_name(
            productRepository.getProductByProductId(cartItem.getProductId()).getProduct_name());
        orderDetail.setImage(
            productRepository.getProductByProductId(cartItem.getProductId()).getProduct_image());

        orderDetailRepository.save(orderDetail);
        cartItemRepository.delete(cartItem);


      }

      session.removeAttribute("cart");
      session.removeAttribute("cartItemList");
      cartRepository.delete(cart);
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
      Cart cart = cartRepository.findCartByUserId(user_id);
      Order order = new Order(address_id, total, status, pStatus, user_id, orderDate);

      orderRepository.save(order);
      List<CartItem> cartItemList = (List<CartItem>) session.getAttribute("cartItemList");
      for (CartItem cartItem : cartItemList) {
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        orderDetail.setProduct_id(cartItem.getProductId());
        orderDetail.setQuantity(cartItem.getQuantity());
        orderDetail.setProduct_name(
            productRepository.getProductByProductId(cartItem.getProductId()).getProduct_name());
        orderDetail.setImage(
            productRepository.getProductByProductId(cartItem.getProductId()).getProduct_image());
        orderDetailRepository.save(orderDetail);
        cartItemRepository.delete(cartItem);
      }
      model.addAttribute("total", total);
      session.removeAttribute("cart");
      session.removeAttribute("cartItemList");
      cartRepository.delete(cart);
      return "order_success";
    } else {
      return "order_fail";
    }

  }
}
