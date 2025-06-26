package com.srinjaydg.endrlink.Repositories;

import com.srinjaydg.endrlink.Models.ShortUrls;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ShortUrlsRepository extends JpaRepository<ShortUrls, UUID> {
}
