package com.fenrir.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
@AllArgsConstructor
public class JwtTokenDTO {

    @NotBlank
    private String accessToken;

    @NotBlank
    private String tokenType;

    public JwtTokenDTO(String accessToken) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
    }
}
