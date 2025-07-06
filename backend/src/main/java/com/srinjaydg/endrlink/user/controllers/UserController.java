package com.srinjaydg.endrlink.user.controllers;

import com.srinjaydg.endrlink.auth.AuthenticationService;
import com.srinjaydg.endrlink.user.dto.UserResponse;
import com.srinjaydg.endrlink.user.dto.UserUpdateRequest;
import com.srinjaydg.endrlink.user.models.Users;
import com.srinjaydg.endrlink.user.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing user profiles and information")
public class UserController {

    private final UserService userService;
    private final AuthenticationService authenticationService;

    @GetMapping("/me")
    @Operation(
            summary = "Get Current User",
            description = "Returns the details of the currently authenticated user."
    )
    public ResponseEntity<UserResponse> getCurrentUser(Authentication connectedUser) {
        return ResponseEntity.ok (userService.getCurrentUser (connectedUser));
    }

    @PutMapping("/me")
    @Operation(
            summary = "Update Current User",
            description = "Updates the details of the currently authenticated user. The request body should contain the updated user information."
    )
    public ResponseEntity<UserResponse> updateCurrentUser(Authentication connectedUser, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok (userService.updateCurrentUser (connectedUser, request));
    }

    @GetMapping("/send-verification-email")
    @Operation(
            summary = "Send Verification Email",
            description = "Sends a verification email to the user. This is typically used to verify the user's email address after registration."
    )
    public ResponseEntity<Void> sendVerificationEmail(
            Authentication connectedUser
    ) throws MessagingException {
        Users user = (Users) connectedUser.getPrincipal();
        authenticationService.sendActivationEmail (user);
        return ResponseEntity.ok().build();
    }
}
