package com.srinjaydg.endrlink.Exceptions;

public class ExistingEmailConflictException extends RuntimeException {
    public ExistingEmailConflictException(String message) {
        super(message);
    }
}
