package com.srinjaydg.endrlink.short_url.mappers;

import com.srinjaydg.endrlink.short_url.dto.ShortUrlResponse;
import com.srinjaydg.endrlink.short_url.models.ShortUrls;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShortUrlMapper {
    public ShortUrlResponse toShortUrlResponse(ShortUrls shortUrls) {
        return ShortUrlResponse.builder()
                .slug(shortUrls.getSlug())
                .originalUrl(shortUrls.getOriginalUrl())
                .createdAt(shortUrls.getCreatedAt().toString())
                .userId(shortUrls.getUser ().getId ())
                .id(shortUrls.getId().toString())
                .clicks(shortUrls.getClicks())
                .build();
    }
}
