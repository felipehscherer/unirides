package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.ride.Ride;
import br.com.unirides.api.domain.ride.RideMapper;
import br.com.unirides.api.domain.ride.RideSearchMapper;
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
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
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

    @Autowired
    private RideService rideService;

    @Autowired
    private RideSearchMapper rideSearchMapper;

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

            Driver driver = driverRepository.findDriverByUsuarioEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("Motorista não encontrado"));

            Vehicle vehicle = vehicleRepository.findFirstActiveVehicleByDriverId(driver.getId())
                    .orElseThrow(() -> new VehicleNotFoundException("Veículo não encontrado"));

            if (rideCreationDTO.getDesiredPassengersNumber() > vehicle.getCapacity()){
                throw new IllegalArgumentException("Limite de passageiros excedido!");
            }

            //Padrão Mapper - diminuindo código repetitivo
            Ride ride = RideMapper.mapToRide(rideCreationDTO, driver, vehicle);

            if (!rideRepository.getRideByAllArguments(
                    rideCreationDTO.getOrigin(), rideCreationDTO.getDestination(), rideCreationDTO.getDistance(),
                    driver.getId(), rideCreationDTO.getDate(),
                    rideCreationDTO.getTime()).isEmpty()
            ){
                throw new IllegalArgumentException("Carona já cadastrada!");
            }

            User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

            ride.getPassengers().add(user);
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

            User passenger = userRepository.findById(rideJoinDTO.getPassengerId())
                    .orElseThrow(() -> new UserNotFoundException("Passageiro não encontrado"));

            Set<User> passengers = ride.getPassengers();

            for (User u : passengers) {
                if (u.getId().equals(rideJoinDTO.getPassengerId())) {
                    throw new IllegalArgumentException("Você já é um passageiro!");
                }
            }

            if (ride.getStatus() != RideStatus.ABERTA) {
                throw new IllegalStateException("Não é possível ingressar em uma carona que não está aberta");
            }

            if (ride.getFreeSeatsNumber() <= ride.getPassengers().size()) {
                throw new IllegalStateException("Não há lugares disponíveis nesta carona");
            }

            ride.getPassengers().add(passenger);
            rideRepository.save(ride);

            return ResponseEntity.ok(ride);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/search") //busca caronas pelo destino
    public ResponseEntity<?> searchRides(@RequestBody RideSearchDTO searchDTO) {
        try {
            List<Ride> rides = rideService.findRidesByDestination(searchDTO);

            if (rides.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }

            // Converte as entidades `Ride` para `RideSearchResponseDTO` usando o mapper
            List<RideSearchResponseDTO> rideDTOs = rides.stream()
                    .map(rideSearchMapper::mapToDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(rideDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("cancel/{ride_id}")
    public ResponseEntity<?> cancelRide(@RequestHeader("Authorization") String token, @PathVariable UUID ride_id){
        try{
            String email = tokenService.validateToken(token.replace("Bearer ", "")); // Supondo que você extraiu o email do token
            if (email == null) {
                throw new IllegalArgumentException("Token inválido ou expirado");
            }

            Driver driver = driverRepository.findDriverByUsuarioEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("Motorista não encontrado"));

            Ride ride = rideRepository.findById(ride_id)
                    .orElseThrow(() -> new IllegalArgumentException("Carona não encontrada!"));

            if (ride.getStatus().equals(RideStatus.ABERTA) && ride.getCnh().equals(driver.getNumeroCnh())) {
                //caso seja motorista, cancela a carona
                ride.setStatus(RideStatus.CANCELADA);
            }else if(ride.getStatus().equals(RideStatus.ABERTA)){
                //caso seja um passageiro, desiste da carona
                User passenger = userRepository.findByEmail(email).
                        orElseThrow(() -> new IllegalArgumentException("Usuário não existe!"));
                ride.getPassengers().remove(passenger);
            }else if (ride.getStatus().equals(RideStatus.CONCLUIDA)){
                return ResponseEntity.badRequest().body("Carona já concluída!");
            }else if (ride.getStatus().equals(RideStatus.CANCELADA)){
                return ResponseEntity.badRequest().body("Carona já está cancelada!");
            } else if (ride.getStatus().equals(RideStatus.EM_PROGRESSO)) {
                return ResponseEntity.badRequest().body("Não foi possível cancelar, carona em progresso!");
            }

            rideRepository.save(ride);
            return ResponseEntity.ok(ride);

        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history/{passenger_id}")  //busca todas as caronas de um usuário pelo ID do usuario
    public ResponseEntity<?> searchAllRides(@PathVariable UUID passenger_id) {
        try {
            List<Ride> rides = rideRepository.findUserRideHistory(passenger_id);
            if (rides.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }

            Optional<User> user = userRepository.findDriverIdByUserId(passenger_id);
            System.out.println(user.isPresent() ? user.get().getId() : 10);

            // Usa o mapper para converter as entidades `Ride` para `RideSearchResponseDTO`
            List<RideSearchResponseDTO> rideDTOs = rides.stream()
                    .map(ride -> rideSearchMapper.mapToDTOWithPassengerId(ride, passenger_id))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(rideDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("search_id/{rideId}")  //busca por ID da carona
    public ResponseEntity<?> searchRideId(@PathVariable UUID rideId){
        try{
            Ride ride = rideRepository.findById(rideId)
                    .orElseThrow(() -> new IllegalArgumentException("Carona não encontrada"));

            RideSearchResponseDTO dto = new RideSearchResponseDTO();
            dto.setRideId(ride.getId());
            dto.setOrigin(ride.getOrigin());
            dto.setDestination(ride.getDestination());
            dto.setOriginAddress(ride.getOriginAddress());
            dto.setDestinationAddress(ride.getDestinationAddress());
            dto.setOriginCity(ride.getOriginCity());
            dto.setDestinationCity(ride.getDestinationCity());
            dto.setPrice(ride.getPrice());
            dto.setTime(ride.getTime());

            // Buscar o Driver e, em seguida, o User para obter o nome
            driverRepository.findByNumeroCnh(ride.getCnh()).flatMap(
                    driver -> userRepository.findByEmail(driver.getUsuarioEmail())).ifPresent(
                    user -> dto.setDriverName(user.getName()));

            dto.setFreeSeatsNumber(ride.getFreeSeatsNumber());
            dto.setDate(ride.getDate());
            dto.setDuration(ride.getDuration());
            dto.setDistance(ride.getDistance());
            dto.setStatus(ride.getStatus());
            dto.setNumPassengers(ride.getPassengers().size());

            Vehicle vehicle = vehicleRepository.findById(ride.getVehicleId())
                    .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado"));
            dto.setCar(vehicle.getBrand() + " " + vehicle.getModel() + " " + vehicle.getColor());

            return ResponseEntity.ok(dto);

        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
