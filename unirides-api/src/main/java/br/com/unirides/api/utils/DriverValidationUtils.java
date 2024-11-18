package br.com.unirides.api.utils;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.dto.driver.DriverRequestDTO;
import br.com.unirides.api.exceptions.CnhAlreadyRegisteredException;
import br.com.unirides.api.exceptions.CnhInvalidDateException;
import br.com.unirides.api.exceptions.CnhInvalidFormatException;
import br.com.unirides.api.repository.DriverRepository;

public class DriverValidationUtils {

    public static void validarDriver(DriverRequestDTO motoristaDTO, DriverRepository driverRepository) {
        if (driverRepository.existsByUsuarioEmail(motoristaDTO.getEmail())) {
            throw new RuntimeException("Já existe um motorista registrado com este e-mail.");
        }

        if (!Driver.validarFormatoCNH(motoristaDTO.getNumeroCnh())) {
            throw new CnhInvalidFormatException("Formato da CNH inválido");
        }

        if (!Driver.validarDataCNH(motoristaDTO.getDataEmissao().toString(), motoristaDTO.getDataValidade().toString())) {
            throw new CnhInvalidDateException("Data da CNH inválida");
        }

        if (driverRepository.findByNumeroCnh(motoristaDTO.getNumeroCnh()).isPresent()) {
            throw new CnhAlreadyRegisteredException("Já existe um motorista registrado com este número de CNH");
        }
    }

    public static void validarUpdateDriver(DriverRequestDTO motoristaDTO, Driver driverData, DriverRepository driverRepository) {
        if (driverRepository.existsByNumeroCnhAndIdNot(driverData.getNumeroCnh(), driverData.getId())) {
            throw new CnhAlreadyRegisteredException("Já existe um motorista registrado com este número de CNH");
        }

        if (!Driver.validarFormatoCNH(motoristaDTO.getNumeroCnh())) {
            throw new CnhInvalidFormatException("Formato da CNH inválido");
        }

        if (!Driver.validarDataCNH(motoristaDTO.getDataEmissao().toString(), motoristaDTO.getDataValidade().toString())) {
            throw new CnhInvalidDateException("Data da CNH inválida");
        }
    }
}
