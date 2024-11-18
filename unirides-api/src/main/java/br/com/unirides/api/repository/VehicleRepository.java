package br.com.unirides.api.repository;


import br.com.unirides.api.domain.driver.Vehicle;
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

    @Query("SELECT v FROM Vehicle v WHERE v.driver.id = :driverId AND v.isActive = true")
    Optional<Vehicle> findFirstActiveVehicleByDriverId(@Param("driverId") UUID driverId);

    boolean existsByPlateAndIdNot(String plate, UUID id);

}
