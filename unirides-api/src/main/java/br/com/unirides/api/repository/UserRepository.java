package br.com.unirides.api.repository;

import br.com.unirides.api.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByCpf(String cpf);
    Optional<User> findById(UUID uuid);

    @Query("SELECT u.name FROM User u WHERE u.id = :id")
    Optional<User> findUserIdByDriverId(UUID id);

    @Query("SELECT d FROM Driver d WHERE d.id = :id")
    Optional<User> findDriverIdByUserId(UUID id);
}
