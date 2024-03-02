package com.fenrir.auth.controller;

import com.fenrir.auth.dto.JwtTokenDTO;
import com.fenrir.auth.dto.NewPasswordDTO;
import com.fenrir.auth.dto.SignInDTO;
import com.fenrir.auth.dto.SignUpDTO;
import com.fenrir.auth.dto.UserDTO;
import com.fenrir.auth.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;


@RequiredArgsConstructor
@RestController
@RequestMapping(
        path = "/api/auth",
        produces = APPLICATION_JSON
)
public class AuthController {
    private final UserService userService;

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> signup(@RequestBody @Valid SignUpDTO signUpDTO, UriComponentsBuilder builder) {
        UserDTO user = userService.registerUser(signUpDTO);
        String username = user.getUsername();
        URI location = builder.replacePath("/api/users/{username}")
                .buildAndExpand(username)
                .toUri();
        return ResponseEntity.created(location).body(user);
    }

    @PostMapping(value = "/signin", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> signIn(@RequestBody @Valid SignInDTO signInDTO) {
        JwtTokenDTO token = userService.authenticateUser(signInDTO);
        return ResponseEntity.ok(token);
    }

    @PostMapping(value = "/valid", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> validateToken(@RequestBody @Valid JwtTokenDTO jwtTokenDTO) {
        return userService.validateToken(jwtTokenDTO)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping(path = "/{username}/change-pass")
    public ResponseEntity<?> changePassword(
            @PathVariable("username") String username,
            @RequestBody NewPasswordDTO passwordDTO) {

        userService.updatePassword(username, passwordDTO);
        return ResponseEntity.noContent().build();
    }
}
