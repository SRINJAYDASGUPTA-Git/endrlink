package com.srinjaydg.endrlink.short_url.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShortUrlResponse {
    private String slug;
    private String originalUrl;
    private String createdAt;
    private UUID userId;
    private String id;
    private Integer clicks;
}
