package br.com.unirides.api.controllers;


import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.vehicle.VehicleRequestDTO;
import br.com.unirides.api.dto.vehicle.VehicleResponseDTO;
import br.com.unirides.api.exceptions.*;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @GetMapping("/get/{plate}")
    public ResponseEntity<VehicleResponseDTO> getVeiculoByPlate(@PathVariable String plate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            email = user.getEmail();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Driver> optDriver = driverRepository.findDriverByUsuarioEmail(email);

        if (optDriver.isPresent()) {
            Optional<Vehicle> veiculoOpt = vehicleRepository.findByPlate(plate);

            if (veiculoOpt.isPresent()) {
                Vehicle vehicle = veiculoOpt.get();

                VehicleResponseDTO vehicleResponseDTO = new VehicleResponseDTO(vehicle);

                return ResponseEntity.ok(vehicleResponseDTO);
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get/byUserEmail/{email}")
    public ResponseEntity<List<VehicleResponseDTO>> getAllVehiclesByUserEmail(@PathVariable String email) {
        Optional<Driver> driverOpt = driverRepository.findDriverByUsuarioEmail(email);

        if (driverOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(null);
        }

        List<Vehicle> vehicles = vehicleRepository.findByDriverId(driverOpt.get().getId());

        if (vehicles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(new ArrayList<>());
        }

        List<VehicleResponseDTO> vehicleResponseDTOList = vehicles.stream()
                .map(VehicleResponseDTO::new)
                .toList();

        return ResponseEntity.ok(vehicleResponseDTOList);
    }

    @PostMapping("/register")
    public ResponseEntity<VehicleResponseDTO> createVeiculo(@RequestBody VehicleRequestDTO data) {

        String email = data.email();

        Optional<Driver> optDriver = driverRepository.findDriverByUsuarioEmail(email);

        if (optDriver.isPresent()) {
            Driver driver = optDriver.get();

            if (validarVeiculo(data.plate().toUpperCase(), data.capacity())) {

                Vehicle vehicleData = new Vehicle(driver.getId(), data.color(), data.capacity(), data.model(), data.brand(), data.plate().toUpperCase(), driver, true);

                vehicleRepository.save(vehicleData);

                VehicleResponseDTO responseDTO = new VehicleResponseDTO(vehicleData);
                return ResponseEntity.status(201).body(responseDTO);
            }

            return ResponseEntity.notFound().build();

        } else {
            throw new CnhNotRegisteredException("Usuário não possui uma CNH registrada");
        }
    }

    public boolean validarVeiculo(String plate, int capacity) {

        if (!Vehicle.validateCapacity(capacity)) {
            throw new CapacityInvalidException("Capacidade do veiculo invalida");
        }
        if (!Vehicle.validatePlate(plate.toUpperCase())) {
            throw new PlateInvalidException("Placa do veiculo invalida!");
        }
        if (vehicleRepository.findByPlate(plate).isPresent()) {
            throw new PlateAlreadyRegistered("Placa do Veiculo ja registrada");
        }
        return true;
    }

    @PutMapping("/update/{plate}")
    public ResponseEntity<VehicleResponseDTO> updateVeiculo(@PathVariable String plate, @RequestBody VehicleRequestDTO updatedVeiculo) {

        Optional<Vehicle> veiculoOpt = vehicleRepository.findByPlate(plate);

        if (veiculoOpt.isPresent()) {
            if (updatedVeiculo.plate() != null &&
                    vehicleRepository.existsByPlateAndIdNot(updatedVeiculo.plate(), veiculoOpt.get().getId())) {
                throw new PlateAlreadyRegistered("Já existe um veículo registrado com esta placa");
            }

            if (!Vehicle.validateCapacity(updatedVeiculo.capacity())) {
                throw new CapacityInvalidException("Capacidade do veiculo invalida");
            }

            if (!Vehicle.validatePlate(updatedVeiculo.plate().toUpperCase())) {
                throw new PlateInvalidException("Placa do veiculo invalida!");
            }

            if (vehicleRepository.existsByPlateAndIdNot(plate, veiculoOpt.get().getId())) {
                throw new PlateAlreadyRegistered("Placa do Veiculo ja registrada");
            }

            Vehicle vehicle = veiculoOpt.get();

            vehicle.setModel(updatedVeiculo.model());
            vehicle.setBrand(updatedVeiculo.brand());
            vehicle.setColor(updatedVeiculo.color());
            vehicle.setCapacity(updatedVeiculo.capacity());
            vehicle.setPlate(updatedVeiculo.plate().toUpperCase());

            vehicleRepository.save(vehicle);

            VehicleResponseDTO responseDTO = new VehicleResponseDTO(vehicle);

            return ResponseEntity.status(201).body(responseDTO);

        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{plate}")
    public ResponseEntity<Void> deleteVeiculo(@PathVariable String plate) {

        Optional<Vehicle> veiculoOpt = vehicleRepository.findByPlate(plate);

        if (veiculoOpt.isPresent()) {
            vehicleRepository.delete(veiculoOpt.get());
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/AllByUserEmail/{email}")
    public ResponseEntity<List<VehicleResponseDTO>> deleteAllByUserEmail(@PathVariable String email) {
        Optional<Driver> driverOpt = driverRepository.findDriverByUsuarioEmail(email);

        if (driverOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(null);
        }

        List<Vehicle> vehicles = vehicleRepository.findByDriverId(driverOpt.get().getId());

        if (vehicles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(new ArrayList<>());
        }

        vehicleRepository.deleteAll(vehicles);

        return ResponseEntity.status(201).body(new ArrayList<>());

    }

}
