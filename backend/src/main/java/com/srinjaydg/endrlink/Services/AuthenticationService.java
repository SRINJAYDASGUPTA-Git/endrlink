package com.srinjaydg.endrlink.Services;

import com.srinjaydg.endrlink.Mapper.UserMapper;
import com.srinjaydg.endrlink.Models.Users;
import com.srinjaydg.endrlink.Repositories.RoleRepository;
import com.srinjaydg.endrlink.Repositories.UserRepository;
import com.srinjaydg.endrlink.Request.AuthenticationRequest;
import com.srinjaydg.endrlink.Response.AuthenticationResponse;
import com.srinjaydg.endrlink.Response.UserResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {
        Users user = userRepository.findByEmail(authenticationRequest.email())
                .orElseThrow(() -> new NoSuchElementException ("User not found"));
        var auth = authenticationManager.authenticate (
                new UsernamePasswordAuthenticationToken (
                        authenticationRequest.email (),
                        authenticationRequest.password ()
                )
        );

        var claims = new HashMap<String, Object> ();
        var userVar = ((Users) auth.getPrincipal ());
        claims.put ("user_email", userVar.getUsername ());
        var jwtToken = jWTService.generateAccessToken (
                claims,
                userVar
        );

        var refreshToken = jWTService.generateRefreshToken (
                claims,
                userVar
        );

        return AuthenticationResponse.builder ()
                .access_token (jwtToken)
                .refresh_token (refreshToken)
                .build ();
    }

    public AuthenticationResponse register(AuthenticationRequest authenticationRequest) {
        var userRole = roleRepository.findByName("USER")
                .orElseThrow (() -> new IllegalStateException ("ROLE USER was not initialized"));
        Users user = Users.builder()
                .name(authenticationRequest.name())
                .email(authenticationRequest.email())
                .password(passwordEncoder.encode (authenticationRequest.password()))
                .roles (List.of (userRole))
                .build();

        userRepository.save(user);
        var auth = authenticationManager.authenticate (
                new UsernamePasswordAuthenticationToken (
                        authenticationRequest.email (),
                        authenticationRequest.password ()
                )
        );

        var claims = new HashMap<String, Object> ();
        var userVar = ((Users) auth.getPrincipal ());
        claims.put ("user_email", userVar.getUsername ());
        var jwtToken = jWTService.generateAccessToken (
                claims,
                userVar
        );

        var refreshToken = jWTService.generateRefreshToken (
                claims,
                userVar
        );

        return AuthenticationResponse.builder ()
                .access_token (jwtToken)
                .refresh_token (refreshToken)
                .build ();
    }

    @Transactional
    public UserResponse getCurrentUser(Authentication connectedUser) {
        Users user = (Users) connectedUser.getPrincipal();
        if (user == null) {
            throw new NoSuchElementException("User not found");
        }
        return userMapper.toUserResponse (user);
    }
}
