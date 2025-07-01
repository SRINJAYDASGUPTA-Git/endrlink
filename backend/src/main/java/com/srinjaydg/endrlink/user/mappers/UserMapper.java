package com.srinjaydg.endrlink.user.mappers;

import com.srinjaydg.endrlink.short_url.mappers.ShortUrlMapper;
import com.srinjaydg.endrlink.user.models.Role;
import com.srinjaydg.endrlink.user.models.Users;
import com.srinjaydg.endrlink.user.dto.UserResponse;
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
