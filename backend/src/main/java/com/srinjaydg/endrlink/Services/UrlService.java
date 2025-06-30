package com.srinjaydg.endrlink.Services;

import com.srinjaydg.endrlink.Mapper.ShortUrlMapper;
import com.srinjaydg.endrlink.Models.ShortUrls;
import com.srinjaydg.endrlink.Models.Users;
import com.srinjaydg.endrlink.Repositories.ShortUrlsRepository;
import com.srinjaydg.endrlink.Response.ShortUrlResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UrlService {

    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
    private static final int SLUG_LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();
    private final ShortUrlMapper shortUrlMapper;
    private final ShortUrlsRepository shortUrlsRepository;

    public String generateSlug() {
        StringBuilder slug = new StringBuilder(SLUG_LENGTH);
        for (int i = 0; i < SLUG_LENGTH; i++) {
            int index = RANDOM.nextInt(ALPHABET.length());
            slug.append(ALPHABET.charAt(index));
        }
        return slug.toString();
    }

    public ShortUrlResponse createShortUrl(String originalUrl, Authentication connectedUser) {
        String slug = generateSlug();
        Users user = (Users) connectedUser.getPrincipal();
        // Check if slug already exists and retry if needed
        // Save to DB

        ShortUrls existingShortUrl = shortUrlsRepository.findByOriginalUrl(originalUrl);
        if (existingShortUrl != null) {
            return shortUrlMapper.toShortUrlResponse(existingShortUrl);
        }
        ShortUrls shortUrls = ShortUrls.builder ()
                .slug(slug)
                .originalUrl(originalUrl)
                .clicks(0)
                .user (user)
                .createdAt (LocalDateTime.now ())
                .build ();

        return shortUrlMapper.toShortUrlResponse (shortUrlsRepository.save(shortUrls));
    }

    public ShortUrlResponse getUrlFromSlug(String slug) {
        ShortUrls shortUrls = shortUrlsRepository.findBySlug (slug).orElseThrow (
                () -> new NoSuchElementException("No URL found for the provided slug: " + slug)
        );
        return shortUrlMapper.toShortUrlResponse(shortUrls);
    }

    public List<ShortUrlResponse> getAllShortUrlsForCurrentUser(Authentication connectedUser) {
        if (connectedUser == null || connectedUser.getPrincipal() == null) {
            return List.of();
        }
        Users user = (Users) connectedUser.getPrincipal();
        List<ShortUrls> shortUrlsList = shortUrlsRepository.findByUser(user);
        if (shortUrlsList.isEmpty()) {
            return List.of();
        }
        return shortUrlsList.stream()
                .map(shortUrlMapper::toShortUrlResponse)
                .toList();
    }
}

