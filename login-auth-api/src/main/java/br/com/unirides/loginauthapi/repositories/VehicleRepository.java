package br.com.unirides.loginauthapi.repositories;


import br.com.unirides.loginauthapi.domain.driver.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    Optional<Vehicle> findByPlate(String plate);

    @Query("SELECT v FROM Vehicle v WHERE v.driver.id = :driver_Id")
    List<Vehicle> findByDriverId(UUID driver_Id);

}
