package com.srinjaydg.endrlink.user.services;

import com.srinjaydg.endrlink.auth.AuthenticationService;
import com.srinjaydg.endrlink.user.dto.UserResponse;
import com.srinjaydg.endrlink.user.dto.UserUpdateRequest;
import com.srinjaydg.endrlink.user.mappers.UserMapper;
import com.srinjaydg.endrlink.user.models.Users;
import com.srinjaydg.endrlink.user.repositories.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthenticationService authenticationService;

    @Transactional
    public UserResponse getCurrentUser(Authentication connectedUser) {
        Users principal = (Users) connectedUser.getPrincipal();
        Users user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateCurrentUser(Authentication connectedUser, UserUpdateRequest request) {
        Users principal = (Users) connectedUser.getPrincipal();
        Users user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        if (request.name() != null) {
            user.setName(request.name());
        }
        if (request.imageUrl() != null) {
            user.setImageUrl(request.imageUrl());
        }
        if (request.email() != null) {
            if(!user.getEmail ().equals (request.email())) {
                user.setEmail(request.email());
                user.setEnabled (false);
                userRepository.save(user);
            }
        }
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }
}
