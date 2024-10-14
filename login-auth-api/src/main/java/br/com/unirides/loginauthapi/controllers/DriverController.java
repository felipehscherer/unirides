package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.driver.DriverLicenseCategory;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.driver.DriverRequestDTO;
import br.com.unirides.loginauthapi.dto.driver.DriverResponseDTO;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/driver")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<DriverResponseDTO> registerDriver(@RequestBody DriverRequestDTO motoristaDTO) {

        if (driverRepository.existsByUsuarioEmail(motoristaDTO.getEmail())) {
            throw new RuntimeException("Já existe um motorista registrado com este e-mail.");
        }

        if (driverRepository.findByNumeroCnh(motoristaDTO.getNumeroCnh()).isPresent()) {
            throw new RuntimeException("Já existe um motorista registrado com este numero de CNH");
        }

        User usuario = userRepository.findByEmail(motoristaDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Driver driver = new Driver();
        driver.setUsuarioEmail(usuario.getEmail());
        driver.setNumeroCnh(motoristaDTO.getNumeroCnh());
        driver.setDataEmissao(motoristaDTO.getDataEmissao());
        driver.setDataValidade(motoristaDTO.getDataValidade());
        driver.setCategoria(DriverLicenseCategory.valueOf(motoristaDTO.getCategoria()));

        driverRepository.save(driver);

        DriverResponseDTO driverDTO = new DriverResponseDTO(driver);
        return ResponseEntity.status(201).body(driverDTO);
    }

    @GetMapping("/get/listAll")
    public ResponseEntity<List<DriverResponseDTO>> getAllDrivers() {

        List<Driver> drivers = driverRepository.findAll();

        List<DriverResponseDTO> responseDTOs = drivers.stream()
                .map(DriverResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/update/{email}")
    public ResponseEntity<DriverResponseDTO> updateDriver(@PathVariable String email, @RequestBody DriverRequestDTO motoristaDTO) {

        Driver driver = driverRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado."));

        driver.setNumeroCnh(motoristaDTO.getNumeroCnh());
        driver.setDataEmissao(motoristaDTO.getDataEmissao());
        driver.setDataValidade(motoristaDTO.getDataValidade());
        driver.setCategoria(DriverLicenseCategory.valueOf(motoristaDTO.getCategoria()));

        driverRepository.save(driver);

        DriverResponseDTO driverDTO = new DriverResponseDTO(driver);
        return ResponseEntity.status(201).body(driverDTO);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable String email) {

        Driver driver = driverRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado."));

        driverRepository.delete(driver);
        return ResponseEntity.noContent().build();

    }

    @GetMapping("/get/{email}")
    public ResponseEntity<UUID> getDriverIdByEmail(@PathVariable String email) {

        Optional<Driver> optDriver = driverRepository.findByUsuarioEmail(email);

        Driver driver = optDriver.get();

        if (driver != null) {
            return ResponseEntity.ok(driver.getId());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
