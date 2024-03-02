package com.fenrir.auth.security;

import com.fenrir.auth.model.User;
import com.fenrir.auth.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user =  userRepository.findByCredentials_Username(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        String.format("User with %s username does not exists.", username)
                ));
        return new UserDetailsImpl(user);
    }
}
