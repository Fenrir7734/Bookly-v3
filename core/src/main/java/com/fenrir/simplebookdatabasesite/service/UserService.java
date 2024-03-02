package com.fenrir.simplebookdatabasesite.service;

import com.fenrir.simplebookdatabasesite.dto.UserDTO;
import com.fenrir.simplebookdatabasesite.dto.UserSlimDTO;
import com.fenrir.simplebookdatabasesite.dto.UserUpdateDTO;
import com.fenrir.simplebookdatabasesite.dto.mapper.UserMapper;
import com.fenrir.simplebookdatabasesite.exception.exceptions.ResourceNotFoundException;
import com.fenrir.simplebookdatabasesite.model.Role;
import com.fenrir.simplebookdatabasesite.model.User;
import com.fenrir.simplebookdatabasesite.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserService {
    private UserRepository userRepository;
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;

    public UserSlimDTO get(String username) {
        User user = getByUsername(username);
        return userMapper.toUserSlimDTO(user);
    }

    public UserSlimDTO get(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("User was not found for id=%d", id)
                ));
        return userMapper.toUserSlimDTO(user);
    }

    public UserDTO getUserDetails(String username) {
        User user = getByUsername(username);
        return userMapper.toUserDTO(user);
    }

    public Role getUserRole(String username) {
        return getByUsername(username).getRole();
    }

    public Page<UserSlimDTO> getAll(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toUserSlimDTO);
    }

    public UserDTO update(String username, UserUpdateDTO userUpdateDTO) {
        User user = getByUsername(username);
        user.setFirstname(userUpdateDTO.getFirstname());
        user.setLastname(userUpdateDTO.getLastname());
        user.getContact().setPhone(userUpdateDTO.getPhone());
        user = userRepository.save(user);
        return userMapper.toUserDTO(user);
    }

    public void updateRole(String username, Role role) {
        User user = getByUsername(username);
        user.setRole(role);
        userRepository.save(user);
    }

    public void block(String username) {
        User user = getByUsername(username);
        user.setBanned(true);
        userRepository.save(user);
    }

    public void unblock(String username) {
        User user = getByUsername(username);
        user.setBanned(false);
        userRepository.save(user);
    }

    public void verify(String username) {
        User user = getByUsername(username);
        user.setVerified(true);
        userRepository.save(user);
    }

    private User getByUsername(String username) {
        return userRepository.findByCredentials_Username(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("User was not found for username=%s", username)
                ));
    }

}
