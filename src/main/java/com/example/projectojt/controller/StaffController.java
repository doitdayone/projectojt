package com.example.projectojt.controller;

import com.example.projectojt.model.Staff;
import com.example.projectojt.service.StaffService;
import com.example.projectojt.service.UserNotFoundException;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("/admin")
public class StaffController {

    @Autowired
    private StaffService service;

    @GetMapping("/staff")
    public String showStaffList(Model model, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        model.addAttribute("staffList", service.listAll());
        return "staff-list";
    }

    @GetMapping("/add")
    public String showAddStaffForm(Model model, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        model.addAttribute("staff", new Staff());
        return "add-staff";
    }

    @PostMapping("/add/new")
    public String addStaff(@ModelAttribute @Valid Staff staff, BindingResult result, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        if (result.hasErrors()) {
            return "add-staff";
        }
        service.save(staff);
        return "redirect:/admin/staff";
    }

    @GetMapping("/edit/{id}")
    public String showEditStaffForm(@PathVariable int id, Model model, HttpSession session) throws UserNotFoundException {
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        // Logic to fetch staff by ID from the list
        Staff staff = service.get(id); // Assuming the list is indexed by ID
        model.addAttribute("staff", staff);
        return "edit-staff";
    }

    @PostMapping("/edit/{id}")
    public String editStaff(@PathVariable int id, @ModelAttribute @Valid Staff updatedStaff, BindingResult result, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        if (result.hasErrors()) {
            return "edit-staff";
        }
        // Logic to update staff in the list
        service.save(updatedStaff); // Assuming the list is indexed by ID
        return "redirect:/admin/staff";
    }

    @GetMapping("/delete/{id}")
    public String deleteStaff(@PathVariable int id, HttpSession session){
        if ((boolean) session.getAttribute("admin")!=true)
            return "error";
        try{
            service.delete(id);
        }
        catch (UserNotFoundException e){
            e.printStackTrace();
        }
        return "redirect:/admin/staff";
    }
}