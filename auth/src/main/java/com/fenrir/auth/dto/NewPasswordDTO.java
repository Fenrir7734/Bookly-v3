package com.fenrir.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class NewPasswordDTO {
    private String oldPassword;
    private String newPassword;
    private String newPasswordConfirmation;
}
