package com.fenrir.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
public class UserDTO {
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private Boolean verified;
    private Boolean banned;
    private LocalDateTime createdAt;
}
