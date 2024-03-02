package com.fenrir.auth.security;

import com.fenrir.auth.exception.exceptions.ForbiddenException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationFacade {

    public void assertAuthenticated() {
        if (!isAuthenticated()) {
            throw new ForbiddenException();
        }
    }

    public void assertNotAuthenticated() {
        if (isAuthenticated()) {
            throw new ForbiddenException();
        }
    }

    public UserDetailsImpl getUserPrincipal() {
        Authentication authentication = getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    private Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private boolean isAuthenticated() {
        Authentication authentication = getAuthentication();
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }
}
