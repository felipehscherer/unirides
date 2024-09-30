package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.driver.DriverLicenseCategory;
import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.driver.DriverRequestDTO;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

    public Driver registerDriver(DriverRequestDTO motoristaDTO) {
        if (driverRepository.existsByUsuarioEmail(motoristaDTO.getEmail())) {
            throw new RuntimeException("Já existe um motorista registrado com este e-mail.");
        }

        if (driverRepository.findByNumeroCnh(motoristaDTO.getNumeroCnh()).isPresent()) {
            throw new RuntimeException("Já existe um motorista registrado com este número de CNH.");
        }

        User usuario = userRepository.findByEmail(motoristaDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Driver motorista = new Driver();
        motorista.setUsuarioEmail(usuario.getEmail());
        motorista.setNumeroCnh(motoristaDTO.getNumeroCnh());
        motorista.setDataEmissao(motoristaDTO.getDataEmissao());
        motorista.setDataValidade(motoristaDTO.getDataValidade());
        motorista.setCategoria(DriverLicenseCategory.valueOf(motoristaDTO.getCategoria()));

        return driverRepository.save(motorista);
    }



    public Driver updateDriverById(Long id, DriverRequestDTO motoristaDTO) {
        Driver motorista = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado."));

        motorista.setNumeroCnh(motoristaDTO.getNumeroCnh());
        motorista.setDataEmissao(motoristaDTO.getDataEmissao());
        motorista.setDataValidade(motoristaDTO.getDataValidade());
        motorista.setCategoria(DriverLicenseCategory.valueOf(motoristaDTO.getCategoria()));

        return driverRepository.save(motorista);
    }

    public void deleteDriverById(Long id) {
        Driver motorista = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado."));
        driverRepository.delete(motorista);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Optional<Driver> findById(Long id) {
        return driverRepository.findById(id);
    }
}
