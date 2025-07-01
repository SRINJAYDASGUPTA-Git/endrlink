package com.srinjaydg.endrlink.auth;

public record AuthenticationRequest(
        String email,
        String password,
        String name
) {
}
