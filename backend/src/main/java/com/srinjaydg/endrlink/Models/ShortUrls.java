package com.srinjaydg.endrlink.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "short_urls")
public class ShortUrls {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    private String originalUrl;

    private String slug;

    private LocalDateTime createdAt;

    private Integer clicks;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;
}
