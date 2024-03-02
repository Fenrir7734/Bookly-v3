package com.fenrir.auth.services;

import com.fenrir.auth.dto.JwtTokenDTO;
import com.fenrir.auth.dto.NewPasswordDTO;
import com.fenrir.auth.dto.SignInDTO;
import com.fenrir.auth.dto.SignUpDTO;
import com.fenrir.auth.dto.UserDTO;
import com.fenrir.auth.exception.exceptions.DuplicateCredentialsException;
import com.fenrir.auth.exception.exceptions.PasswordMismatchException;
import com.fenrir.auth.exception.exceptions.ResourceNotFoundException;
import com.fenrir.auth.mapper.UserMapper;
import com.fenrir.auth.model.Credentials;
import com.fenrir.auth.model.User;
import com.fenrir.auth.repository.UserRepository;
import com.fenrir.auth.security.UserDetailsImpl;
import com.fenrir.auth.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserService {
    private UserRepository userRepository;
    private UserMapper userMapper;
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private JwtUtils jwtUtils;

    public UserDTO registerUser(SignUpDTO signupDTO) {
        if (userRepository.existsByContact_Email(signupDTO.getEmail())) {
            throw new DuplicateCredentialsException("Account with this email address already exists.");
        }
        if (userRepository.existsByCredentials_Username(signupDTO.getUsername())) {
            throw new DuplicateCredentialsException("Account with this username already exists.");
        }

        User user = userMapper.fromSignupDTO(signupDTO);
        Credentials credentials = user.getCredentials();
        credentials.setPassword(passwordEncoder.encode(credentials.getPassword()));
        user = userRepository.save(user);
        return userMapper.toUserDTO(user);
    }

    public JwtTokenDTO authenticateUser(SignInDTO signInDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signInDTO.getUsername(),
                        signInDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();
        String token = jwtUtils.generateJwtToken(principal);
        return userMapper.toJwtTokenDTO(token);
    }

    public boolean validateToken(JwtTokenDTO tokenDTO) {
        return jwtUtils.validateToken(tokenDTO.getAccessToken());
    }

    public void updatePassword(String username, NewPasswordDTO passwordDTO) {
        User user = getByUsername(username);
        Credentials credentials = user.getCredentials();

        if (!passwordEncoder.matches(passwordDTO.getOldPassword(), credentials.getPassword())) {
            throw new PasswordMismatchException("Provided password do not match current password");
        }

        String newPassword = passwordDTO.getNewPassword();
        if (!newPassword.equals(passwordDTO.getNewPasswordConfirmation())) {
            throw new PasswordMismatchException("New password and confirmation password are different");
        }

        String encodedNewPassword = passwordEncoder.encode(newPassword);
        credentials.setPassword(encodedNewPassword);
        userRepository.save(user);
    }

    private User getByUsername(String username) {
        return userRepository.findByCredentials_Username(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("User was not found for username=%s", username)
                ));
    }
}
