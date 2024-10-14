package br.com.unirides.loginauthapi.controllers;


import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.driver.Vehicle;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.vehicle.VehicleRequestDTO;
import br.com.unirides.loginauthapi.dto.vehicle.VehicleResponseDTO;
import br.com.unirides.loginauthapi.exceptions.CnhNotRegisteredException;
import br.com.unirides.loginauthapi.exceptions.InvalidCapacityException;
import br.com.unirides.loginauthapi.exceptions.InvalidPlateException;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    // metodp que busca um veiculo pela placa
    @GetMapping("/get/{plate}")
    public ResponseEntity<VehicleResponseDTO> getVeiculoByPlate(@PathVariable String plate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof User) {
            User user = (User) principal;
            String email = user.getEmail();
        } else {
            System.out.println("Carro não encontrado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Vehicle> veiculoOpt = vehicleRepository.findByPlate(plate); //busca o veículo


        return ResponseEntity.notFound().build();
    }

    //Metodo que busca todos os veículos
    @GetMapping("/get/listAll")
    public List<VehicleResponseDTO> getAllVehicles() {

        List<VehicleResponseDTO> vehicleResponseDTOList = vehicleRepository.findAll().stream().map(VehicleResponseDTO::new).toList();

        return vehicleResponseDTOList;

    }

    //metodo para criar um novo veículo
    @PostMapping("/register")
    public ResponseEntity<VehicleResponseDTO> createVeiculo(@RequestBody VehicleRequestDTO data) {
        if (authenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        String email = data.email();

        Optional<Driver> optDriver = driverRepository.findByUsuarioEmail(email);

        if (optDriver.isPresent()) {
            Driver driver = optDriver.get();

            if (!Vehicle.validateCapacity(data.capacity())) {
                throw new InvalidCapacityException("Capacidade do veiculo invalida");
            }

            else if (!Vehicle.validatePlate(data.plate())){
                throw new InvalidPlateException("Placa do veiculo invalida!");
            }
            else {
                Vehicle vehicleData = new Vehicle(driver.getId(), data.color(), data.capacity(), data.model(), data.brand(), data.plate(), driver);

                vehicleRepository.save(vehicleData);

                VehicleResponseDTO responseDTO = new VehicleResponseDTO(vehicleData);
                return ResponseEntity.status(201).body(responseDTO);
            }
        } else {
            throw new CnhNotRegisteredException("Usuário não possui uma CNH registrada");
        }
    }

    // meotodo para atualizar um veiculo pela placa
    @PutMapping("/update/{plate}")
    public ResponseEntity<VehicleResponseDTO> updateVeiculo(@PathVariable String plate, @RequestBody VehicleRequestDTO updatedVeiculo) {
        if (authenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Vehicle> veiculoOpt = vehicleRepository.findByPlate(plate);

        if (veiculoOpt.isPresent()) {
            Vehicle vehicle = veiculoOpt.get();
            vehicle.setModel(updatedVeiculo.model());
            vehicle.setBrand(updatedVeiculo.brand());
            vehicle.setPlate(updatedVeiculo.plate());

            vehicleRepository.save(vehicle);

            VehicleResponseDTO responseDTO = new VehicleResponseDTO(vehicle);
            return ResponseEntity.status(201).body(responseDTO);
        }


        return ResponseEntity.notFound().build();
    }

    // metodo para deletar um veiculo pela placa
    @DeleteMapping("/delete/{plate}")
    public ResponseEntity<Void> deleteVeiculo(@PathVariable String plate) {
        if (authenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Vehicle> veiculoOpt = vehicleRepository.findByPlate(plate);

        if (veiculoOpt.isPresent()) {
            vehicleRepository.delete(veiculoOpt.get());
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    private boolean authenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            return true;
        }
        return false;
    }

}
