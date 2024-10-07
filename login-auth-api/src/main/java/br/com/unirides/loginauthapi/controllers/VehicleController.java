package br.com.unirides.loginauthapi.controllers;


import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.driver.Vehicle;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.vehicle.VehicleRequestDTO;
import br.com.unirides.loginauthapi.dto.vehicle.VehicleResponseDTO;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import br.com.unirides.loginauthapi.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    private VehicleRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    //método para buscar um veículo pela placa
    @GetMapping("/{plate}")
    public ResponseEntity<VehicleResponseDTO> getVeiculoByPlate(@PathVariable String plate) {
        Optional<Vehicle> veiculoOpt = repository.findByPlate(plate); //busca o veículo


        if (veiculoOpt.isPresent()) {
            Vehicle vehicle = veiculoOpt.get();

            Optional<Driver> driverOpt = driverRepository.findByUsuarioEmail(vehicle.getUsuarioEmail());

            Driver driver = driverOpt.get();

            VehicleResponseDTO responseDTO = new VehicleResponseDTO(vehicle.getId(), vehicle.getUsuarioEmail(), vehicle.getColor(), vehicle.getCapacity(), vehicle.getModel(), vehicle.getBrand(), vehicle.getPlate(), driver.getId());
            return ResponseEntity.ok(responseDTO); //retorna o veiculo encontrado
        }

        return ResponseEntity.notFound().build(); //retorna 404se não encontrar
    }

    //Metodo que busca todos os veículos
    @GetMapping
    public List<VehicleResponseDTO> getAllVehicles() {

        List<VehicleResponseDTO> vehicleResponseDTOList = repository.findAll().stream().map(VehicleResponseDTO::new).toList();

        return vehicleResponseDTOList;

    }

    //metodo para criar um novo veículo
    @PostMapping
    public ResponseEntity<VehicleResponseDTO> createVeiculo(@RequestBody VehicleRequestDTO data) {
        Optional<Driver> driverOpt = driverRepository.findByUsuarioEmail(data.email());


        if (repository.findByPlate(data.plate()).isPresent()) {
            throw new RuntimeException("Já existe um veiculo registrado com esta placa.");
        }

        if(driverOpt.isPresent()) {
            Driver driver = driverOpt.get();
            Vehicle vehicleData = new Vehicle(data.id(), data.email(), data.color(), data.capacity(), data.model(), data.brand(), data.plate(), driver.getId()); //cria um novo veiculo com os dados que foram recebidos


            User usuario = userRepository.findByEmail(vehicleData.getUsuarioEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));



            repository.save(vehicleData); // salva o veiculo no BD

            VehicleResponseDTO responseDTO = new VehicleResponseDTO(vehicleData);
            return ResponseEntity.status(201).body(responseDTO); //retorna o veiculo que foi criado
        }
        else {
            throw new RuntimeException("É necessario cadastrar uma cnh em sua conta antes de adicionar um veiculo.");
        }



    }

    //metodo que atualiza um veículo existente
    @PutMapping("/{plate}")
    public ResponseEntity<VehicleResponseDTO> updateVeiculo(@PathVariable String plate, @RequestBody VehicleRequestDTO updatedVeiculo) {
        Optional<Vehicle> veiculoOpt = repository.findByPlate(plate);

        if (veiculoOpt.isPresent()) {
            Vehicle vehicle = veiculoOpt.get();
            vehicle.setModel(updatedVeiculo.model()); // Atualiza o modelo
            vehicle.setBrand(updatedVeiculo.brand()); //atualiza a marca
            vehicle.setPlate(updatedVeiculo.plate()); // Atualiza a placa

            repository.save(vehicle); // Salva as atualizações

            VehicleResponseDTO responseDTO = new VehicleResponseDTO(vehicle);
            return ResponseEntity.status(201).body(responseDTO); //Retorna o veiculo criado
        }

        return ResponseEntity.notFound().build(); //retorna 404 se o veículo não for encontrado
    }

    //metodo para deletar um veículo
    @DeleteMapping("/{plate}")
    public ResponseEntity<Void> deleteVeiculo(@PathVariable String plate) {
        Optional<Vehicle> veiculoOpt = repository.findByPlate(plate);

        if (veiculoOpt.isPresent()) {
            repository.delete(veiculoOpt.get()); // Deleta o veículo encontrado
            return ResponseEntity.noContent().build(); //retorna 204
        }

        return ResponseEntity.notFound().build(); //retorna 404 se o veículo não for encontrado
    }
}
