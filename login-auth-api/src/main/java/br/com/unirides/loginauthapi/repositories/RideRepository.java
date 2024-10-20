package br.com.unirides.loginauthapi.repositories;

import br.com.unirides.loginauthapi.domain.ride.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RideRepository extends JpaRepository<Ride, UUID> {
    List<Ride> findByDriverId(UUID driverId);
    List<Ride> findByVehicleId(UUID vehicleId);
    List<Ride> findByPassengersId(UUID passengerId);
}

