package com.srinjaydg.endrlink.short_url.controllers;

import com.srinjaydg.endrlink.short_url.dto.ShortUrlRequest;
import com.srinjaydg.endrlink.short_url.dto.ShortUrlResponse;
import com.srinjaydg.endrlink.short_url.services.UrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/url")
@RequiredArgsConstructor
@Tag(name = "URL Management", description = "Endpoints for managing and shortening URLs")
public class UrlController {
    private final UrlService urlService;

    @PostMapping("/shorten")
    @Operation(
            summary = "Shorten URL",
            description = "Creates a shortened version of the provided URL. The user must be authenticated to use this endpoint."
    )
    public ResponseEntity<ShortUrlResponse> shortenUrl(
            @RequestBody ShortUrlRequest requestParams,
            Authentication connectedUser
    ) {
        if (requestParams.url() == null || requestParams.url().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(urlService.createShortUrl (requestParams.url (), connectedUser));
    }

    @GetMapping("/{slug}")
    @Operation(
            summary = "Get URL from Slug",
            description = "Retrieves the original URL associated with the provided slug. If the slug does not exist, a 404 error is returned."
    )
    public ResponseEntity<ShortUrlResponse> getUrlFromSlug(
            @PathVariable(name = "slug") String slug
    ) {
        return ResponseEntity.ok (urlService.getUrlFromSlug(slug));
    }

    @GetMapping("/")
    @Operation(
            summary = "Get All Short URLs for Current User",
            description = "Retrieves all shortened URLs created by the currently authenticated user. Returns a list of ShortUrlResponse objects."
    )
    public  ResponseEntity<List<ShortUrlResponse>> getAllShortUrlsForCurrentUser(
            Authentication connectedUser
    ){
        if (connectedUser == null || connectedUser.getPrincipal() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        List<ShortUrlResponse> shortUrls = urlService.getAllShortUrlsForCurrentUser(connectedUser);
        return shortUrls.isEmpty () ? ResponseEntity.status (HttpStatus.NOT_FOUND).build () : ResponseEntity.ok(shortUrls);
    }
}
