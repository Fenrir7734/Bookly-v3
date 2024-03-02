package com.fenrir.auth.exception.exceptions;

import lombok.experimental.StandardException;

@StandardException
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
