package br.com.unirides.loginauthapi.repositories;

import br.com.unirides.loginauthapi.domain.driver.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByNumeroCnh(String numeroCnh);

    Optional<Driver> findByUsuarioEmail(String email);

    boolean existsByUsuarioEmail(String email);
}
