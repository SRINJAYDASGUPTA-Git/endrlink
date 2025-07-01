package com.srinjaydg.endrlink.auth;

import com.srinjaydg.endrlink.exceptions.ExistingEmailConflictException;
import com.srinjaydg.endrlink.security.JWTService;
import com.srinjaydg.endrlink.user.mappers.UserMapper;
import com.srinjaydg.endrlink.user.models.Users;
import com.srinjaydg.endrlink.user.repositories.RoleRepository;
import com.srinjaydg.endrlink.user.repositories.UserRepository;
import com.srinjaydg.endrlink.user.dto.UserResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JWTService jWTService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
    private static final int PASSWORD_LENGTH = 16;

    public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {
        Users user = userRepository.findByEmail(authenticationRequest.email())
                .orElseThrow(() -> new NoSuchElementException ("User not found"));
        return getAuthenticationResponse(authenticationRequest);
    }

    public AuthenticationResponse register(AuthenticationRequest authenticationRequest) throws BadRequestException {
        var userRole = roleRepository.findByName("USER")
                .orElseThrow (() -> new IllegalStateException ("ROLE USER was not initialized"));

        if (userRepository.existsByEmail(authenticationRequest.email())) {
            throw new ExistingEmailConflictException("Email already exists");
        }
        if (authenticationRequest.name() == null || authenticationRequest.email() == null || authenticationRequest.password() == null) {
            throw new BadRequestException("Name, email, and password must not be null");
        }
        Users user = Users.builder()
                .name(authenticationRequest.name())
                .email(authenticationRequest.email())
                .password(passwordEncoder.encode (authenticationRequest.password()))
                .roles (List.of (userRole))
                .build();

        userRepository.save(user);
        return getAuthenticationResponse(authenticationRequest);
    }

    private AuthenticationResponse getAuthenticationResponse(AuthenticationRequest authenticationRequest) {
        var auth = authenticationManager.authenticate (
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.email (),
                        authenticationRequest.password ()
                )
        );
        var userVar = ((Users) auth.getPrincipal ());
        return buildJwtResponse(userVar);
    }

    @Transactional
    public UserResponse getCurrentUser(Authentication connectedUser) {
        Users principal = (Users) connectedUser.getPrincipal();
        Users user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return userMapper.toUserResponse(user);
    }

    public AuthenticationResponse oauth2Login(AuthenticationRequest request) {
        Users user = userRepository.findByEmail(request.email())
                .orElse(null);
        if (user != null) {
            return buildJwtResponse(user);
        }
        // If user does not exist, register them
            AuthenticationRequest requestWithPassword = new AuthenticationRequest(request.email(), generateSecurePassword(), request.name());
            Users newUser = Users.builder()
                    .name(requestWithPassword.name())
                    .email(requestWithPassword.email())
                    .password(passwordEncoder.encode(requestWithPassword.password()))
                    .roles(List.of(roleRepository.findByName("USER")
                            .orElseThrow(() -> new IllegalStateException("ROLE USER was not initialized"))))
                    .build();
            userRepository.save(newUser);
            return buildJwtResponse(newUser);

    }

    private static String generateSecurePassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }

        return password.toString();
    }

    private AuthenticationResponse buildJwtResponse(Users user){
        var claims = new HashMap<String, Object>();
        claims.put ("user_email", user.getUsername ());
        var jwtToken = jWTService.generateAccessToken (
                claims,
                user
        );

        var refreshToken = jWTService.generateRefreshToken (
                claims,
                user
        );

        return AuthenticationResponse.builder ()
                .access_token (jwtToken)
                .refresh_token (refreshToken)
                .build ();
    }

    @Transactional
    public AuthenticationResponse refreshToken(Authentication connectedUser) {
        Users principal = (Users) connectedUser.getPrincipal();
        Users user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return buildJwtResponse(user);
    }
}
