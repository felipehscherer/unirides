package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.DriverLicenseCategory;
import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.driver.DriverRequestDTO;
import br.com.unirides.api.dto.driver.DriverResponseDTO;
import br.com.unirides.api.exceptions.CnhAlreadyRegisteredException;
import br.com.unirides.api.exceptions.CnhInvalidCategoryException;
import br.com.unirides.api.exceptions.CnhInvalidDateException;
import br.com.unirides.api.exceptions.CnhInvalidFormatException;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.UserRepository;
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

        String cnhFormatada = formatarNumeroCnh(motoristaDTO.getNumeroCnh());

        validarDriver(motoristaDTO);

        User usuario = userRepository.findByEmail(motoristaDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Driver driver = new Driver();
        driver.setUsuarioEmail(usuario.getEmail());
        driver.setNumeroCnh(cnhFormatada);
        driver.setDataEmissao(motoristaDTO.getDataEmissao());
        driver.setDataValidade(motoristaDTO.getDataValidade());
        driver.setCategoria(DriverLicenseCategory.valueOf(motoristaDTO.getCategoria().toUpperCase()));

        driverRepository.save(driver);

        DriverResponseDTO driverDTO = new DriverResponseDTO(driver);
        return ResponseEntity.status(201).body(driverDTO);
    }

    public static String formatarNumeroCnh(String numeroCnh) {

        String numeroCnhFormatado = numeroCnh.replaceAll("\\D", "");

        return numeroCnhFormatado;
    }

    public boolean validarDriver(DriverRequestDTO motoristaDTO) {

        String cnhFormatada = formatarNumeroCnh(motoristaDTO.getNumeroCnh());

        if (driverRepository.existsByUsuarioEmail(motoristaDTO.getEmail())) {
            throw new RuntimeException("Já existe um motorista registrado com este e-mail.");
        }

        if (!Driver.validarFormatoCNH(cnhFormatada)) {
            throw new CnhInvalidFormatException("Formato da cnh invalida");
        }

        if (!Driver.validarDataCNH(motoristaDTO.getDataEmissao().toString(), motoristaDTO.getDataValidade().toString())) {
            throw new CnhInvalidDateException("Data da cnh Invalida");
        }

        if (driverRepository.findByNumeroCnh(motoristaDTO.getNumeroCnh()).isPresent()) {
            throw new CnhAlreadyRegisteredException("Já existe um motorista registrado com este numero de CNH");
        }

        if (!Driver.validarCategoria(motoristaDTO.getCategoria().toUpperCase())) {
            throw new CnhInvalidCategoryException("Categoria invalida");
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

        String cnhFormatada = formatarNumeroCnh(motoristaDTO.getNumeroCnh());

        Driver driver = driverRepository.findDriverByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado."));

        Optional<Driver> driverData = driverRepository.findDriverByUsuarioEmail(email);
        try {
            if (driverData.isPresent()) {

                if (!Driver.validarCategoria(motoristaDTO.getCategoria().toUpperCase())) {
                    throw new CnhInvalidCategoryException("Categoria invalida");
                }

                if (driverRepository.existsByNumeroCnhAndIdNot(driverData.get().getNumeroCnh(), driverData.get().getId())) {
                    throw new CnhAlreadyRegisteredException("Já existe um motorista registrado com este número de CNH");
                }

                if (!Driver.validarFormatoCNH(cnhFormatada)) {
                    throw new CnhInvalidFormatException("Formato da CNH inválido");
                }

                if (!Driver.validarDataCNH(motoristaDTO.getDataEmissao().toString(), motoristaDTO.getDataValidade().toString())) {
                    throw new CnhInvalidFormatException("Data da CNH inválida");
                }

                driver.setNumeroCnh(cnhFormatada);
                driver.setDataEmissao(motoristaDTO.getDataEmissao());
                driver.setDataValidade(motoristaDTO.getDataValidade());
                driver.setCategoria(DriverLicenseCategory.valueOf(motoristaDTO.getCategoria().toUpperCase()));

                driverRepository.save(driver);

                return ResponseEntity.status(201).body("Atualizado com sucesso!");
            } else {
                return ResponseEntity.status(404).body("Motorista não encontrado.");
            }
        } catch (CnhInvalidFormatException e) {
            throw new CnhInvalidFormatException(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            throw new CnhAlreadyRegisteredException(e.getMessage());
        } catch (CnhInvalidCategoryException e){
            throw new CnhInvalidCategoryException(e.getMessage());
        } catch (CnhInvalidDateException e){
            throw new CnhInvalidDateException(e.getMessage());
        }
        catch (Exception e) {
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
