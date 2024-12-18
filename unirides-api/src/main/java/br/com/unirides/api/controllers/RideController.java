package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.ride.Ride;
import br.com.unirides.api.domain.ride.RideStatus;
import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.ride.RideCreationDTO;
import br.com.unirides.api.dto.ride.RideJoinDTO;
import br.com.unirides.api.dto.ride.RideSearchDTO;
import br.com.unirides.api.dto.ride.RideSearchResponseDTO;
import br.com.unirides.api.exceptions.UserNotFoundException;
import br.com.unirides.api.exceptions.VehicleNotFoundException;
import br.com.unirides.api.infra.security.TokenService;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.RideRepository;
import br.com.unirides.api.repository.UserRepository;
import br.com.unirides.api.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

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

    TokenService tokenService;

    @Autowired
    public RideController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRide(@RequestHeader("Authorization") String token, @RequestBody RideCreationDTO rideCreationDTO) {
        try {
            // Valida o token e recupera o userId
            String email = tokenService.validateToken(token.replace("Bearer ", "")); // Supondo que você extraiu o email do token
            if (email == null) {
                throw new IllegalArgumentException("Token inválido ou expirado");
            }

            // Busca o Driver e o Vehicle usando o userId
            Driver driver = driverRepository.findDriverByUsuarioEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("Motorista não encontrado"));

            Vehicle vehicle = vehicleRepository.findFirstActiveVehicleByDriverId(driver.getId())
                    .orElseThrow(() -> new VehicleNotFoundException("Veículo não encontrado"));

            if (rideCreationDTO.getDesiredPassengersNumber() > vehicle.getCapacity()){
                throw new IllegalArgumentException("Limite de passageiros excedido!");
            }

            Ride ride = new Ride();
            ride.setDriverId(driver.getId());
            ride.setVehicleId(vehicle.getId());
            ride.setCnh(driver.getNumeroCnh());
            ride.setOrigin(rideCreationDTO.getOrigin());
            ride.setDestination(rideCreationDTO.getDestination());
            ride.setOriginAddress(rideCreationDTO.getOriginAddress());
            ride.setDestinationAddress(rideCreationDTO.getDestinationAddress());
            ride.setDate(rideCreationDTO.getDate());
            ride.setTime(rideCreationDTO.getTime());
            ride.setDesiredPassengersNumber(rideCreationDTO.getDesiredPassengersNumber());
            ride.setPassengersLimit(vehicle.getCapacity());
            ride.setPrice(rideCreationDTO.getPrice());
            ride.setDistance(rideCreationDTO.getDistance());
            ride.setDuration(rideCreationDTO.getDuration());
            ride.setStatus(RideStatus.ABERTA);
            ride.setFreeSeatsNumber(rideCreationDTO.getDesiredPassengersNumber());


            if (!rideRepository.getRideByAllArguments(
                    rideCreationDTO.getOrigin(), rideCreationDTO.getDestination(), rideCreationDTO.getDistance(),
                    driver.getId(), rideCreationDTO.getDate(),
                    rideCreationDTO.getTime()).isEmpty()
            ){
                throw new IllegalArgumentException("Carona já cadastrada!");
            }

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

            if (ride.getFreeSeatsNumber() <= ride.getPassengers().size()) {
                throw new IllegalStateException("Não há lugares disponíveis nesta carona");
            }

            User passenger = userRepository.findById(rideJoinDTO.getPassengerId())
                    .orElseThrow(() -> new UserNotFoundException("Passageiro não encontrado"));

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
                    .orElseThrow(() -> new UserNotFoundException("Passageiro não encontrado"));

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

    @PostMapping("/search")
    public ResponseEntity<?> searchRides(@RequestBody RideSearchDTO searchDTO) {
        try {
            List<Ride> rides = rideRepository.findByDestinationContainingIgnoreCase(searchDTO.getDestination());

            if (rides.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }

            // Converte as entidades `Ride` para `RideDTO`
            List<RideSearchResponseDTO> rideDTOs = rides.stream().map(ride -> {
                RideSearchResponseDTO dto = new RideSearchResponseDTO();
                dto.setOrigin(ride.getOrigin());
                dto.setDestination(ride.getDestination());
                dto.setOriginAddress(ride.getOriginAddress());
                dto.setDestinationAddress(ride.getDestinationAddress());
                dto.setPrice(ride.getPrice());

                Driver driver = driverRepository.findById(ride.getDriverId()).orElseThrow(
                        () -> new UserNotFoundException("Motorista não encontrado")
                );
                User user = userRepository.findUserIdByDriverId(driver.getId()).orElseThrow(
                        () -> new UserNotFoundException("Usuário não encontrado")
                );

                dto.setDriverName(user.getName());  // Exemplo, supondo que tenha um objeto `driver`
                dto.setFreeSeatsNumber(ride.getFreeSeatsNumber());
                dto.setDate(ride.getDate());  // Converte para string, se necessário
                dto.setDuration(ride.getDuration());
                dto.setDistance(ride.getDistance());
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(rideDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
