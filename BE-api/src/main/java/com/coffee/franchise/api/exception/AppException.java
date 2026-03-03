package com.coffee.franchise.api.exception;

import org.springframework.http.HttpStatus;

public class AppException extends RuntimeException {

    private final HttpStatus status;
    public AppException( HttpStatus status,String message) {
        super(message);
        this.status = status;
    }
}
