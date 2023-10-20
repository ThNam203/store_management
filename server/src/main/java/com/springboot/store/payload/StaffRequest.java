package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.springboot.store.utils.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder

@NoArgsConstructor
@AllArgsConstructor
public class StaffRequest {
    private int id;
    @NotBlank(message = "Name is required")
    private String name;
    @NotEmpty(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;
    private String password;
    private String address;
    private String phoneNumber;
    private String facebook;
    private String avatar;
    private String description;
    private String sex;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;
    private Role role;
}