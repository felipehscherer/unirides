package br.com.unirides.loginauthapi.repositories;


import br.com.unirides.loginauthapi.domain.driver.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByPlate(String plate);
}
