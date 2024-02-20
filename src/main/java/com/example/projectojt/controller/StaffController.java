package com.example.projectojt.controller;

import com.example.projectojt.model.Staff;
import com.example.projectojt.service.StaffService;
import com.example.projectojt.service.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;

@Controller
public class StaffController {

    @Autowired
    private StaffService service;

    @GetMapping("/staff")
    public String showStaffList(Model model) {
        model.addAttribute("staffList", service.listAll());
        return "staff-list";
    }

    @GetMapping("/add")
    public String showAddStaffForm(Model model) {
        model.addAttribute("staff", new Staff());
        return "add-staff";
    }

    @PostMapping("/add/new")
    public String addStaff(@ModelAttribute @Valid Staff staff, BindingResult result) {
        if (result.hasErrors()) {
            return "add-staff";
        }
        service.save(staff);
        return "redirect:/staff";
    }

    @GetMapping("/edit/{id}")
    public String showEditStaffForm(@PathVariable int id, Model model) throws UserNotFoundException {
        // Logic to fetch staff by ID from the list
        Staff staff = service.get(id); // Assuming the list is indexed by ID
        model.addAttribute("staff", staff);
        return "edit-staff";
    }

    @PostMapping("/edit/{id}")
    public String editStaff(@PathVariable int id, @ModelAttribute @Valid Staff updatedStaff, BindingResult result) {
        if (result.hasErrors()) {
            return "edit-staff";
        }
        // Logic to update staff in the list
        service.save(updatedStaff); // Assuming the list is indexed by ID
        return "redirect:/staff";
    }

    @GetMapping("/delete/{id}")
    public String deleteStaff(@PathVariable int id) throws UserNotFoundException {
        // Logic to delete staff from the list
        service.delete(id); // Assuming the list is indexed by ID
        return "redirect:/staff";
    }
}