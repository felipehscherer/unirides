package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.driver.DriverLicenseCategory;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.driver.DriverRequestDTO;
import br.com.unirides.loginauthapi.dto.driver.DriverResponseDTO;
import br.com.unirides.loginauthapi.exceptions.CnhAlreadyRegisteredException;
import br.com.unirides.loginauthapi.exceptions.InvalidCnhException;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
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

        validarDriver(motoristaDTO);

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

    public boolean validarDriver(DriverRequestDTO motoristaDTO) {
        if (driverRepository.existsByUsuarioEmail(motoristaDTO.getEmail())) {
            throw new RuntimeException("Já existe um motorista registrado com este e-mail.");
        }

        if (!Driver.validarFormatoCNH(motoristaDTO.getNumeroCnh())) {
            throw new InvalidCnhException("Formato da cnh invalida");
        }

        if (!Driver.validarDataCNH(motoristaDTO.getDataEmissao().toString(), motoristaDTO.getDataValidade().toString())) {
            throw new InvalidCnhException("Data da cnh Invalida");
        }

        if (driverRepository.findByNumeroCnh(motoristaDTO.getNumeroCnh()).isPresent()) {
            throw new CnhAlreadyRegisteredException("Já existe um motorista registrado com este numero de CNH");
        }
        return true;
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
    public ResponseEntity<String> updateDriver(@PathVariable String email, @RequestBody DriverRequestDTO motoristaDTO) {

        Driver driver = driverRepository.findDriverByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado."));

        Optional<Driver> driverData = driverRepository.findDriverByUsuarioEmail(email);
        try {
            if (driverData.isPresent()) {
                if (driverRepository.existsByNumeroCnhAndIdNot(driverData.get().getNumeroCnh(), driverData.get().getId())) {
                    throw new CnhAlreadyRegisteredException("Já existe um motorista registrado com este número de CNH");
                }

                if (!Driver.validarFormatoCNH(motoristaDTO.getNumeroCnh())) {
                    throw new InvalidCnhException("Formato da CNH inválido");
                }

                if (!Driver.validarDataCNH(motoristaDTO.getDataEmissao().toString(), motoristaDTO.getDataValidade().toString())) {
                    throw new InvalidCnhException("Data da CNH inválida");
                }

                driver.setNumeroCnh(motoristaDTO.getNumeroCnh());
                driver.setDataEmissao(motoristaDTO.getDataEmissao());
                driver.setDataValidade(motoristaDTO.getDataValidade());
                driver.setCategoria(DriverLicenseCategory.valueOf(motoristaDTO.getCategoria()));

                driverRepository.save(driver);

                return ResponseEntity.status(201).body("Atualizado com sucesso!");
            } else {
                return ResponseEntity.status(404).body("Motorista não encontrado.");
            }
        } catch (InvalidCnhException e) {
            throw new InvalidCnhException(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            throw new CnhAlreadyRegisteredException("já existe um motorista com este número de CNH.");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar dados do motorista, tente novamente.");
        }

    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<Void> deleteDriver(@PathVariable String email) {

        Driver driver = driverRepository.findDriverByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado."));

        driverRepository.delete(driver);

        return ResponseEntity.status(201).build();

    }

    @GetMapping("/get/{email}")
    public ResponseEntity<DriverResponseDTO> getDriverIdByEmail(@PathVariable String email) {

        Optional<Driver> optDriver = driverRepository.findDriverByUsuarioEmail(email);

        if (optDriver.isPresent()) {
            Driver driver = optDriver.get();
            DriverResponseDTO driverDTO = new DriverResponseDTO(driver);
            return ResponseEntity.status(201).body(driverDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
