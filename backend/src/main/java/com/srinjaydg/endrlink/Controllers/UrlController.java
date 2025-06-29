package com.srinjaydg.endrlink.Controllers;

import com.srinjaydg.endrlink.Request.ShortUrlRequest;
import com.srinjaydg.endrlink.Response.ShortUrlResponse;
import com.srinjaydg.endrlink.Services.UrlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/url")
public class UrlController {
    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping("/shorten")
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
    public ResponseEntity<ShortUrlResponse> getUrlFromSlug(
            @PathVariable(name = "slug") String slug
    ) {
        return ResponseEntity.ok (urlService.getUrlFromSlug(slug));
    }

    @GetMapping("/")
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
