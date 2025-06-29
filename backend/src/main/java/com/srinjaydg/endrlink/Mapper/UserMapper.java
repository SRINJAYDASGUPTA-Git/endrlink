package com.srinjaydg.endrlink.Mapper;

import com.srinjaydg.endrlink.Models.Role;
import com.srinjaydg.endrlink.Models.Users;
import com.srinjaydg.endrlink.Response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserMapper {
    private final ShortUrlMapper shortUrlMapper;

     public UserResponse toUserResponse(Users user) {
         return UserResponse.builder()
                 .id(user.getId())
                 .name(user.getName())
                 .email(user.getEmail())
                 .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
                 .shortUrls(user.getShortUrls().stream().map(shortUrlMapper::toShortUrlResponse).collect(Collectors.toList()))
                 .build();
     }
}
