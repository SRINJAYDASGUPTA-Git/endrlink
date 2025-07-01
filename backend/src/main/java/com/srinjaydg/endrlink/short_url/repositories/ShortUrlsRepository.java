package com.srinjaydg.endrlink.short_url.repositories;

import com.srinjaydg.endrlink.short_url.models.ShortUrls;
import com.srinjaydg.endrlink.user.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShortUrlsRepository extends JpaRepository<ShortUrls, UUID> {
    Optional<ShortUrls> findBySlug(String slug);

    @Query(value = """
          SELECT * FROM short_urls
          WHERE original_url = :originalUrl
          """, nativeQuery = true)
    ShortUrls findByOriginalUrl(String originalUrl);

    List<ShortUrls> findByUser(Users user);
}
