package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.ride.Ride;
import br.com.unirides.api.domain.ride.RideStatus;
import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.ride.RideCreationDTO;
import br.com.unirides.api.dto.ride.RideJoinDTO;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.RideRepository;
import br.com.unirides.api.repository.UserRepository;
import br.com.unirides.api.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/rides")
public class RideController {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createRide(@RequestBody RideCreationDTO rideCreationDTO) {
        try {
            Driver driver = driverRepository.findById(rideCreationDTO.getDriverId())
                    .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado"));

            Vehicle vehicle = vehicleRepository.findById(rideCreationDTO.getVehicleId())
                    .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado"));

            Ride ride = new Ride();
            ride.setDriver(driver);
            ride.setVehicle(vehicle);
            ride.setDestinoInicial(rideCreationDTO.getDestinoInicial());
            ride.setDestinoFinal(rideCreationDTO.getDestinoFinal());
            ride.setLugaresDisponiveis(rideCreationDTO.getLugaresDisponiveis());
            ride.setHorarioPartida(rideCreationDTO.getHorarioPartida());
            ride.setHorarioChegada(rideCreationDTO.getHorarioChegada());
            ride.setStatus(RideStatus.ABERTA);

            rideRepository.save(ride);

            return ResponseEntity.ok(ride);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{rideId}/join")
    public ResponseEntity<?> joinRide(@PathVariable UUID rideId, @RequestBody RideJoinDTO rideJoinDTO) {
        try {
            Ride ride = rideRepository.findById(rideId)
                    .orElseThrow(() -> new IllegalArgumentException("Carona não encontrada"));

            if (ride.getStatus() != RideStatus.ABERTA) {
                throw new IllegalStateException("Não é possível ingressar em uma carona que não está aberta");
            }

            if (ride.getLugaresDisponiveis() <= ride.getPassengers().size()) {
                throw new IllegalStateException("Não há lugares disponíveis nesta carona");
            }

            User passenger = userRepository.findById(rideJoinDTO.getPassengerId())
                    .orElseThrow(() -> new IllegalArgumentException("Passageiro não encontrado"));

            ride.getPassengers().add(passenger);
            rideRepository.save(ride);

            return ResponseEntity.ok(ride);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{rideId}/passengers/{passengerId}")
    public ResponseEntity<?> cancelRide(@PathVariable UUID rideId, @PathVariable UUID passengerId) {
        try {
            Ride ride = rideRepository.findById(rideId)
                    .orElseThrow(() -> new IllegalArgumentException("Carona não encontrada"));

            User passenger = userRepository.findById(passengerId)
                    .orElseThrow(() -> new IllegalArgumentException("Passageiro não encontrado"));

            if (ride.getPassengers().remove(passenger)) {
                rideRepository.save(ride);
                return ResponseEntity.ok("Passageiro removido da carona com sucesso");
            } else {
                throw new IllegalStateException("O passageiro não está nesta carona");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
