package br.com.unirides.api.repository;

import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.ride.Ride;
import br.com.unirides.api.dto.ride.RideSearchDTO;
import org.jetbrains.annotations.NotNull;
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
    //List<Ride> findRideByDestination(RideSearchDTO rideSearchDTO);

    @Query("SELECT r FROM Ride r WHERE r.origin = :origin AND r.destination = :destination AND r.distance = :distance AND r.driverId = :driverId AND r.date = :date AND r.time = :time")
    List<Ride> getRideByAllArguments(String origin, String destination, String distance, UUID driverId,
                                 LocalDate date, String time);

    @NotNull
    List<Ride> findAll();

    @Query("SELECT r FROM Ride r LEFT JOIN r.passengers p WHERE p.id = :userId OR r.driverId = :userId")
    List<Ride> findUserRideHistory(UUID userId);


}
