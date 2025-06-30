package com.srinjaydg.endrlink.Repositories;

import com.srinjaydg.endrlink.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<Users, UUID> {
    @Override
    Optional<Users> findById(UUID uuid);

    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);
}
