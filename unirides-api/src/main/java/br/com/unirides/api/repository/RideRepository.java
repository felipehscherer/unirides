package br.com.unirides.api.repository;

import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.ride.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.com.unirides.api.domain.ride.RideStatus;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RideRepository extends JpaRepository<Ride, UUID> {
    List<Ride> findByDriverId(UUID driverId);
    List<Ride> findByVehicleId(UUID vehicleId);
    List<Ride> findByPassengersId(UUID passengerId);
    List<Ride> findRideByOriginAddress(String address);
    List<Ride> findRideByDestinationAddress(String address);

    @Query("SELECT r FROM Ride r WHERE r.originCoords = :origin AND r.destinationCoords = :destination AND r.distance = :distance AND r.driverId = :driverId AND r.date = :date AND r.time = :time")
    List<Ride> getRideByAllArguments(String origin, String destination, String distance, UUID driverId,
                                 LocalDate date, String time);

    @Query(value = "SELECT * FROM Ride r WHERE LOWER(unaccent(r.destination)) LIKE LOWER(unaccent(CONCAT('%', :destination, '%')))", nativeQuery = true)
    List<Ride> findByDestinationContainingIgnoreCase(@Param("destination") String destination);

    List<Ride> findAll();


}
