package com.example.projectojt.dto;

import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.*;

@Getter
@Setter
public class BuildedPCDTO {
    @NotEmpty(message = "The name is required")
    private String name;

    @NotEmpty(message = "The productID is required")
    private String productIds;

    @Min(0)
    private int price;

    private MultipartFile images;


    @Size(min = 10, message = "The description should be at least 10 characters")
    @Size(max = 2000, message = "The description can not exceed 2000 characters")
    private String description;
}
