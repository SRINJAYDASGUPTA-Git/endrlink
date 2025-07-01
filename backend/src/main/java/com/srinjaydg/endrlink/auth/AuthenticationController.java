package com.srinjaydg.endrlink.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag (name = "Authentication", description = "Endpoints for user authentication and registration")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    @Operation(
            summary = "User Login",
            description = "Allows a user to log in with their credentials and receive an authentication token."
    )
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/register")
    @Operation(
            summary = "User Registration",
            description = "Allows a new user to register with their name, email, and password. Returns an authentication token upon successful registration."

    )
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody AuthenticationRequest request
    ) throws BadRequestException {
        return ResponseEntity.ok (authenticationService.register(request));
    }

    @GetMapping("/me")
    @Operation(
            summary = "Get Current User",
            description = "Returns the details of the currently authenticated user."
    )
    public ResponseEntity<?> getCurrentUser(Authentication connectedUser) {
        return ResponseEntity.ok (authenticationService.getCurrentUser (connectedUser));
    }

    @PostMapping("/oauth2/login")
    @Operation(
            summary = "OAuth2 Login",
            description = "Handles OAuth2 login for users. This endpoint is used to authenticate users via OAuth2 providers."
    )
    public ResponseEntity<AuthenticationResponse> oauth2Login(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.oauth2Login(request));
    }

    @GetMapping("/refresh")
    @Operation(
            summary = "Refresh Token",
            description = "Refreshes the authentication token for the user. This is useful for maintaining user sessions without requiring re-login."
    )
    public ResponseEntity<AuthenticationResponse> refreshToken(
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(authenticationService.refreshToken(connectedUser));
    }
}
