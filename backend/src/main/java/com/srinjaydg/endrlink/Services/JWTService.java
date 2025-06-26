package com.srinjaydg.endrlink.Services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
public class JWTService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration; // In milliseconds

    @Value("${application.security.jwt.refresh-expiration}")
    private long jwtRefreshExpiration; // In milliseconds

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Generates an access token for the given phone number and role.
     *
     * @param user_id the phone number of the user
     * @param role the role of the user
     * @return the generated access token
     */

    public String generateAccessToken(String user_id, String role) {
        Map<String, Object> claims = Map.of(
                "user_id", user_id,
                "role", role
        );

        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String generateAdminAccessToken(String user_id, String name, String role) {
        Map<String, Object> claims = Map.of(
                "user_id", user_id,
                "name", name,
                "role", role
        );

        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Generates a refresh token for the given phone number and role.
     *
     * @param user_id the phone number of the user
     * @param role the role of the user
     * @return the generated refresh token
     */

    public String generateRefreshToken(String user_id, String role) {
        Map<String, Object> claims = Map.of(
                "user_id", user_id,
                "role", role
        );

        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtRefreshExpiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Validates the given access token.
     *
     * @param token the access token to validate
     * @param user_id the phone number of the user
     * @return true if the access token is valid, false otherwise
     */

    public boolean isAccessTokenValid(String token, String user_id) {
        return extractClaim(token, "user_id", String.class).equals(user_id)
                && !isAccessTokenExpired(token);
    }

    /**
     * Checks if the given access token is expired.
     *
     * @param token the access token to check
     * @return true if the access token is expired, false otherwise
     */

    private boolean isAccessTokenExpired(String token) {
        return extractClaim(token, "exp", Date.class).before(new Date());
    }

    /**
     * Validates the given refresh token.
     *
     * @param token the refresh token to validate
     * @param user_id id of the user to fetch the phone number
     * @return true if the refresh token is valid, false otherwise
     */

    public boolean isRefreshTokenValid(String token, String user_id) {
        return extractClaim(token, "user_id", String.class).equals(user_id)
                && !isRefreshTokenExpired(token);
    }

    /**
     * Checks if the given refresh token is expired.
     *
     * @param token the refresh token to check
     * @return true if the refresh token is expired, false otherwise
     */

    private boolean isRefreshTokenExpired(String token) {
        return extractClaim(token, "exp", Date.class).before(new Date());
    }

    /**
     * Extracts the claim from the given token.
     *
     * @param token the token from which to extract the claim
     * @param claimKey the key of the claim to extract
     * @param claimType the type of the claim to extract
     * @param <T> the type of the claim to extract
     * @return the extracted claim
     */

    public <T> T extractClaim(String token, String claimKey, Class<T> claimType) {
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get(claimKey, claimType);
    }
}

