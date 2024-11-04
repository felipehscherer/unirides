package Controller;

import br.com.unirides.loginauthapi.controllers.DriverController;
import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.dto.driver.DriverRequestDTO;
import br.com.unirides.loginauthapi.exceptions.CnhAlreadyRegisteredException;
import br.com.unirides.loginauthapi.exceptions.InvalidCnhException;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class DriverControllerExceptionTest {

    @InjectMocks
    private DriverController driverController;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private UserRepository userRepository;

    private DriverRequestDTO driverRequestDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        driverRequestDTO = new DriverRequestDTO();
        driverRequestDTO.setEmail("test@example.com");
        driverRequestDTO.setNumeroCnh("12345678900");
        driverRequestDTO.setDataEmissao(LocalDate.parse("2020-01-01"));
        driverRequestDTO.setDataValidade(LocalDate.parse("2030-01-01"));
        driverRequestDTO.setCategoria("B");
    }

    @Test
    void testRegisterDriver_CnhAlreadyRegisteredException() {
        when(driverRepository.findByNumeroCnh(driverRequestDTO.getNumeroCnh()))
                .thenReturn(Optional.of(new Driver()));

        assertThrows(CnhAlreadyRegisteredException.class, () -> {
            driverController.registerDriver(driverRequestDTO);
        });

        verify(driverRepository, never()).save(any(Driver.class));
    }

    @Test
    void testRegisterDriver_InvalidCnhException() {
        driverRequestDTO.setNumeroCnh("123");

        doThrow(new InvalidCnhException("Formato da CNH inválido"))
                .when(driverRepository).existsByUsuarioEmail(driverRequestDTO.getEmail());

        assertThrows(InvalidCnhException.class, () -> {
            driverController.registerDriver(driverRequestDTO);
        });
    }

    @Test
    void testRegisterDriver_DataIntegrityViolationException() {
        when(driverRepository.save(any(Driver.class)))
                .thenThrow(new DataIntegrityViolationException("Violação de integridade de dados"));

        Exception exception = assertThrows(CnhAlreadyRegisteredException.class, () -> {
            driverController.registerDriver(driverRequestDTO);
        });

        assertEquals("já existe um motorista com este número de CNH.", exception.getMessage());
    }

    @Test
    void testUpdateDriver_DriverNotFoundException() {
        when(driverRepository.findDriverByUsuarioEmail(driverRequestDTO.getEmail()))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            driverController.updateDriver(driverRequestDTO.getEmail(), driverRequestDTO);
        });

        assertEquals("Motorista não encontrado.", exception.getMessage());
    }

    @Test
    void testDeleteDriver_NotFoundException() {
        when(driverRepository.findDriverByUsuarioEmail(driverRequestDTO.getEmail()))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            driverController.deleteDriver(driverRequestDTO.getEmail());
        });

        assertEquals("Motorista não encontrado.", exception.getMessage());
    }

    @Test
    void testGetDriverIdByEmail_NotFound() {
        when(driverRepository.findDriverByUsuarioEmail(driverRequestDTO.getEmail()))
                .thenReturn(Optional.empty());

        ResponseEntity<?> response = driverController.getDriverIdByEmail(driverRequestDTO.getEmail());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
