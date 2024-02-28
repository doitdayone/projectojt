package com.example.projectojt.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegisterRequest {
  private String re_password;
  private String email;
  private String password;
}