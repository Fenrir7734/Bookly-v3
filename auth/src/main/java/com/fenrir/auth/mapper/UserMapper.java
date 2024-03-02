package com.fenrir.auth.mapper;

import com.fenrir.auth.dto.JwtTokenDTO;
import com.fenrir.auth.dto.SignUpDTO;
import com.fenrir.auth.dto.UserDTO;
import com.fenrir.auth.model.Contact;
import com.fenrir.auth.model.Credentials;
import com.fenrir.auth.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toUserDTO(User user) {
        return new UserDTO(
                user.getCredentials().getUsername(),
                user.getFirstname(),
                user.getLastname(),
                user.getContact().getEmail(),
                user.getContact().getPhone(),
                user.getVerified(),
                user.getBanned(),
                user.getCreatedAt()
        );
    }

    public JwtTokenDTO toJwtTokenDTO(String token) {
        return new JwtTokenDTO(token);
    }

    public User fromSignupDTO(SignUpDTO signupDTO) {
        Credentials credentials = new Credentials(signupDTO.getUsername(), signupDTO.getPassword());
        Contact contact = new Contact(signupDTO.getEmail(), signupDTO.getPhone());
        return new User(
                signupDTO.getFirstname(),
                signupDTO.getLastname(),
                credentials,
                contact,
                true,
                false
        );
    }
}
