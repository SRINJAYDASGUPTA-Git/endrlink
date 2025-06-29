package com.srinjaydg.endrlink.Request;

public record AuthenticationRequest(
        String email,
        String password,
        String name
) {
}
