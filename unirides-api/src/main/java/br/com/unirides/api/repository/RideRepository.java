package br.com.unirides.api.repository;

import br.com.unirides.api.domain.ride.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.unirides.api.domain.ride.RideStatus;


import java.util.List;
import java.util.UUID;

@Repository
public interface RideRepository extends JpaRepository<Ride, UUID> {
    List<Ride> findByDriverId(UUID driverId);
    List<Ride> findByVehicleId(UUID vehicleId);
    List<Ride> findByPassengersId(UUID passengerId);
    List<Ride> findByStatusAndDestinoInicialContainingIgnoreCaseOrStatusAndDestinoFinalContainingIgnoreCase(
            RideStatus status1, String destino, RideStatus status2, String destinoFinal);
}
