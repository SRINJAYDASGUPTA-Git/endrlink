package com.srinjaydg.endrlink.user.controllers;

import com.srinjaydg.endrlink.user.dto.UserResponse;
import com.srinjaydg.endrlink.user.dto.UserUpdateRequest;
import com.srinjaydg.endrlink.user.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
}
