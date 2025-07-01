package com.srinjaydg.endrlink.exceptions;

public class ExistingEmailConflictException extends RuntimeException {
    public ExistingEmailConflictException(String message) {
        super(message);
    }
}
