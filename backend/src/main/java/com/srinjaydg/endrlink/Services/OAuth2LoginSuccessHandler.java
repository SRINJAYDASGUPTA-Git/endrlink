package com.srinjaydg.endrlink.Services;

import com.srinjaydg.endrlink.Models.Users;
import com.srinjaydg.endrlink.Repositories.RoleRepository;
import com.srinjaydg.endrlink.Repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Find or create user
        var userRole = roleRepository.findByName("USER")
                .orElseThrow (() -> new IllegalStateException ("ROLE USER was not initialized"));
        Users user = userRepository.findByEmail(email).orElseGet(() -> {
            Users newUser = Users.builder()
                    .email(email)
                    .name(name)
                    .roles(List.of(userRole))
                    .build();
            return userRepository.save(newUser);
        });

        // Generate JWT
        String accessToken = jwtService.generateAccessToken(Map.of(), user);
        String refreshToken = jwtService.generateRefreshToken(Map.of(), user);

        // Return token as JSON
        response.setContentType("application/json");
        response.getWriter().write("""
            {
              "access_token": "%s",
              "refresh_token": "%s"
            }
        """.formatted(accessToken, refreshToken));
    }
}
