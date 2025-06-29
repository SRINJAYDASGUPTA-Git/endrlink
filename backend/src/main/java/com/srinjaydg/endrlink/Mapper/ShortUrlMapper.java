package com.srinjaydg.endrlink.Mapper;

import com.srinjaydg.endrlink.Models.ShortUrls;
import com.srinjaydg.endrlink.Response.ShortUrlResponse;
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
