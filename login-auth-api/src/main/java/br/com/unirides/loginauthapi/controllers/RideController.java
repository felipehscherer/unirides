package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.driver.Vehicle;
import br.com.unirides.loginauthapi.domain.ride.Ride;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.ride.CreateRideDTO;
import br.com.unirides.loginauthapi.exceptions.CaronaNotFoundException;
import br.com.unirides.loginauthapi.exceptions.UserNotFoundException;
import br.com.unirides.loginauthapi.exceptions.VehicleNotFoundException;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.RideRepository;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import br.com.unirides.loginauthapi.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;
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

    @PostMapping
    public ResponseEntity<Ride> createRide(@RequestBody CreateRideDTO rideDTO) {
        // Verificar se o motorista existe
        Driver driver = driverRepository.findById(rideDTO.getDriverId())
                .orElseThrow(() -> new UserNotFoundException("Motorista não encontrado"));

        // Verificar se o veículo existe e está vinculado ao motorista
        Vehicle vehicle = vehicleRepository.findById(rideDTO.getVehicleId())
                .orElseThrow(() -> new VehicleNotFoundException("Veículo não encontrado"));

        if (!vehicle.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Veículo não vinculado ao motorista");
        }

        // Verificar se os passageiros existem
        Set<User> passengers = new HashSet<>();
        for (UUID passengerId : rideDTO.getPassengerIds()) {
            User passenger = userRepository.findById(String.valueOf(passengerId))
                    .orElseThrow(() -> new UserNotFoundException("Passageiro não encontrado"));
            passengers.add(passenger);
        }

        // Criar a carona
        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setVehicle(vehicle);
        ride.setPassengers(passengers);
        ride.setParadas(rideDTO.getParadas()); // Aqui passamos a lista de paradas
        ride.setLugaresDisponiveis(rideDTO.getLugaresDisponiveis());
        ride.setHorarioPartida(rideDTO.getHorarioPartida());
        ride.setHorarioChegada(rideDTO.getHorarioChegada());

        Ride savedRide = rideRepository.save(ride);

        return ResponseEntity.ok(savedRide);
    }

    @DeleteMapping("/{rideId}")
    public ResponseEntity<Void> deleteRide(@PathVariable UUID rideId) {
        // Verificar se a carona existe
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new CaronaNotFoundException("Carona não encontrada"));

        // Excluir a carona
        rideRepository.delete(ride);

        // Retornar 204 No Content para indicar sucesso
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{rideId}")
    public ResponseEntity<Ride> updateRide(@PathVariable UUID rideId, @RequestBody CreateRideDTO rideDTO) {
        // Verificar se a carona existe
        Ride existingRide = rideRepository.findById(rideId)
                .orElseThrow(() -> new CaronaNotFoundException("Carona não encontrada"));

        // Verificar se o motorista existe
        Driver driver = driverRepository.findById(rideDTO.getDriverId())
                .orElseThrow(() -> new UserNotFoundException("Motorista não encontrado"));

        // Verificar se o veículo existe e está vinculado ao motorista
        Vehicle vehicle = vehicleRepository.findById(rideDTO.getVehicleId())
                .orElseThrow(() -> new VehicleNotFoundException("Veículo não encontrado"));

        if (!vehicle.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Veículo não vinculado ao motorista");
        }

        // Verificar se os passageiros existem
        Set<User> passengers = new HashSet<>();
        for (UUID passengerId : rideDTO.getPassengerIds()) {
            User passenger = userRepository.findById(String.valueOf(passengerId))
                    .orElseThrow(() -> new UserNotFoundException("Passageiro não encontrado"));
            passengers.add(passenger);
        }

        // Atualizar os dados da carona existente
        existingRide.setDriver(driver);
        existingRide.setVehicle(vehicle);
        existingRide.setPassengers(passengers);
        existingRide.setParadas(rideDTO.getParadas());
        existingRide.setLugaresDisponiveis(rideDTO.getLugaresDisponiveis());
        existingRide.setHorarioPartida(rideDTO.getHorarioPartida());
        existingRide.setHorarioChegada(rideDTO.getHorarioChegada());

        // Salvar as mudanças
        Ride updatedRide = rideRepository.save(existingRide);

        // Retornar a carona atualizada
        return ResponseEntity.ok(updatedRide);
    }
}
