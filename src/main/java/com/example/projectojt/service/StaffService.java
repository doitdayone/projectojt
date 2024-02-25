package com.example.projectojt.service;

import com.example.projectojt.model.Product;
import com.example.projectojt.model.Staff;
import com.example.projectojt.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {
    @Autowired
    private StaffRepository repository;

    public List<Staff> listAll() {
        return (List<Staff>) repository.findAll(Sort.by(Sort.Direction.DESC,"ID"));
    }

    public void save(Staff staff){
        repository.save(staff);
    }

    public Staff get(int id) throws UserNotFoundException {
        Optional<Staff> result = repository.findById(id);
        if (result.isPresent()){
            return result.get();
        }
        throw new UserNotFoundException("Could not find any staff with ID" + id);
    }
    public void delete(int id) throws UserNotFoundException {
        Optional<Staff> result = repository.findById(id);
        if (result.isPresent()){
            repository.deleteById(id);
        }
        throw new UserNotFoundException("Could not find any staff with ID" + id);
    }
}
