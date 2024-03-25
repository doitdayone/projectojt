package com.example.projectojt.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.*;

@Getter
@Setter
public class ProductDTO {
    @NotEmpty(message = "The name is required")
    private String name;

    @NotEmpty(message = "The brand is required")
    private String brand;

    @NotEmpty(message = "The type is required")
    private String type;

    @Min(0)
    private int price;

    @Min(0)
    private int sale;

    private MultipartFile images;

    @Min(0)
    private int rating;

    @Min(0)
    private int quantity;

    @Size(min = 10, message = "The description should be at least 10 characters")
    @Size(max = 2000, message = "The description can not exceed 2000 characters")
    private String detail;
}
