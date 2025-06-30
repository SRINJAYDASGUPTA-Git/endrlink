package com.srinjaydg.endrlink.Controllers;

import com.srinjaydg.endrlink.Request.AuthenticationRequest;
import com.srinjaydg.endrlink.Response.AuthenticationResponse;
import com.srinjaydg.endrlink.Services.AuthenticationService;
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
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody AuthenticationRequest request
    ) throws BadRequestException {
        return ResponseEntity.ok (authenticationService.register(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication connectedUser) {
        return ResponseEntity.ok (authenticationService.getCurrentUser (connectedUser));
    }
}
