package com.srinjaydg.endrlink.user.repositories;

import com.srinjaydg.endrlink.user.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<Users, UUID> {
    @Override
    Optional<Users> findById(UUID uuid);

    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);
}
