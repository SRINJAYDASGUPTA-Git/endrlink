package com.srinjaydg.endrlink.Controllers;

import com.srinjaydg.endrlink.Models.ShortUrls;
import com.srinjaydg.endrlink.Repositories.ShortUrlsRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@RestController
public class RootController {
    private final ShortUrlsRepository shortUrlsRepository;

    public RootController(ShortUrlsRepository shortUrlsRepository) {
        this.shortUrlsRepository = shortUrlsRepository;
    }

    @GetMapping("/")
    @Operation(
            summary = "Root Endpoint",
            description = "Returns a message indicating that the EndrLink API server is running successfully."
    )
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("EndrLink API Server Running successfully!");
    }

    @GetMapping("/{slug}")
    @Operation(
            summary = "Redirect Endpoint",
            description = "Redirects to the original URL based on the provided slug."
    )
    public ResponseEntity<Void> redirectToOriginalUrl(
            @PathVariable(name = "slug") String slug
    ) {
        ShortUrls shortUrls = shortUrlsRepository.findBySlug(slug).orElseThrow(
                () -> new NoSuchElementException ("No URL found for the provided slug: " + slug)
        );
        if (shortUrls.getOriginalUrl() == null || shortUrls.getOriginalUrl().isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        shortUrls.setClicks (shortUrls.getClicks () + 1);
        shortUrlsRepository.save(shortUrls);
        return ResponseEntity.status(HttpStatus.PERMANENT_REDIRECT)
                .header("Location", shortUrls.getOriginalUrl())
                .build();
    }
}
