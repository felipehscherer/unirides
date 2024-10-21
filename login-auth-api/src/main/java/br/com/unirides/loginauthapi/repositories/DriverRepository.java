package br.com.unirides.loginauthapi.repositories;

import br.com.unirides.loginauthapi.domain.driver.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DriverRepository extends JpaRepository<Driver, UUID> {

    Optional<Driver> findByNumeroCnh(String numeroCnh);

    boolean existsByNumeroCnhAndIdNot(String numeroCnh, UUID id);

    Optional<Driver> findDriverByUsuarioEmail(String email);

    boolean existsByUsuarioEmail(String email);
}
