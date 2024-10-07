package br.com.unirides.loginauthapi.repositories;

import br.com.unirides.loginauthapi.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByCpf(String cpf);
}
