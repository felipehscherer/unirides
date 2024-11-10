package br.com.unirides.api.repository;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.user.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DriverRepository extends JpaRepository<Driver, UUID> {

    Optional<Driver> findByNumeroCnh(String numeroCnh);

    boolean existsByNumeroCnhAndIdNot(String numeroCnh, UUID id);

    Optional<Driver> findDriverByUsuarioEmail(String email);

    boolean existsByUsuarioEmail(String email);

    @NotNull
    Optional<Driver> findById(UUID id);

    //Optional<Driver> findById(UUID uuid);
}
