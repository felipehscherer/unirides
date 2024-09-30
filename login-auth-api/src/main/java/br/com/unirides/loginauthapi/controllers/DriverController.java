package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.dto.driver.DriverRequestDTO;
import br.com.unirides.loginauthapi.dto.driver.DriverResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping
    public ResponseEntity<DriverResponseDTO> registerDriver(@RequestBody DriverRequestDTO motoristaDTO) {
        Driver motorista = driverService.registerDriver(motoristaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new DriverResponseDTO(motorista));
    }

    @GetMapping
    public ResponseEntity<List<DriverResponseDTO>> getAllDrivers() {
        List<Driver> drivers = driverService.getAllDrivers();

        List<DriverResponseDTO> responseDTOs = drivers.stream()
                .map(DriverResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DriverResponseDTO> updateDriver(
            @PathVariable Long id,
            @RequestBody DriverRequestDTO motoristaDTO) {
        Driver motoristaAtualizado = driverService.updateDriverById(id, motoristaDTO);
        return ResponseEntity.ok(new DriverResponseDTO(motoristaAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriverById(id);
        return ResponseEntity.noContent().build();
    }
}
