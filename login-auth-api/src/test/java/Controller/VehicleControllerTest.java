package Controller;

import br.com.unirides.loginauthapi.controllers.VehicleController;
import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.driver.Vehicle;
import br.com.unirides.loginauthapi.dto.vehicle.VehicleRequestDTO;
import br.com.unirides.loginauthapi.dto.vehicle.VehicleResponseDTO;
import br.com.unirides.loginauthapi.exceptions.CnhNotRegisteredException;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class VehicleControllerTest {

    @InjectMocks
    private VehicleController vehicleController;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private DriverRepository driverRepository;

    private VehicleRequestDTO vehicleRequestDTO;
    private Driver testDriver;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testDriver = new Driver();
        vehicleRequestDTO = new VehicleRequestDTO("test@example.com", "Vermelho", 4, "ModeloX", "MarcaY", "ABC1234", testDriver);
    }

    @Test
    void testCreateVeiculo_CnhNotRegisteredException() {
        vehicleRequestDTO = new VehicleRequestDTO("test@example.com", "Vermelho", 4, "ModeloX", "MarcaY", "ABC1234", null);

        assertThrows(CnhNotRegisteredException.class, () -> {
            vehicleController.createVeiculo(vehicleRequestDTO);
        });
    }

    @Test
    void testUpdateVeiculo_Success() {
        Vehicle vehicle = new Vehicle();
        when(vehicleRepository.findByPlate("ABC1234")).thenReturn(Optional.of(vehicle));

        ResponseEntity<VehicleResponseDTO> response = vehicleController.updateVeiculo("ABC1234", vehicleRequestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void testUpdateVeiculo_NotFound() {
        when(vehicleRepository.findByPlate("XYZ7890")).thenReturn(Optional.empty());

        ResponseEntity<VehicleResponseDTO> response = vehicleController.updateVeiculo("XYZ7890", vehicleRequestDTO);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDeleteVeiculo_Success() {
        Vehicle vehicle = new Vehicle();
        when(vehicleRepository.findByPlate("ABC1234")).thenReturn(Optional.of(vehicle));

        ResponseEntity<Void> response = vehicleController.deleteVeiculo("ABC1234");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(vehicleRepository).delete(vehicle);
    }

    @Test
    void testDeleteVeiculo_NotFound() {
        when(vehicleRepository.findByPlate("XYZ7890")).thenReturn(Optional.empty());

        ResponseEntity<Void> response = vehicleController.deleteVeiculo("XYZ7890");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetVeiculoByPlate_Success() {
        Vehicle vehicle = new Vehicle();
        when(vehicleRepository.findByPlate("ABC1234")).thenReturn(Optional.of(vehicle));
        when(driverRepository.findDriverByUsuarioEmail(vehicleRequestDTO.email())).thenReturn(Optional.of(testDriver));

        ResponseEntity<VehicleResponseDTO> response = vehicleController.getVeiculoByPlate("ABC1234");

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testGetVeiculoByPlate_NotFound() {
        when(vehicleRepository.findByPlate("XYZ7890")).thenReturn(Optional.empty());

        ResponseEntity<VehicleResponseDTO> response = vehicleController.getVeiculoByPlate("XYZ7890");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateVeiculo_Success() {
        when(vehicleRepository.findByPlate(vehicleRequestDTO.plate())).thenReturn(Optional.empty());

        ResponseEntity<VehicleResponseDTO> response = vehicleController.createVeiculo(vehicleRequestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(vehicleRepository).save(any(Vehicle.class));
    }
}
