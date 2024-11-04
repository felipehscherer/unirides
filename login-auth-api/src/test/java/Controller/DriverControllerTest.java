package Controller;

import br.com.unirides.loginauthapi.controllers.DriverController;
import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.driver.DriverRequestDTO;
import br.com.unirides.loginauthapi.dto.driver.DriverResponseDTO;
import br.com.unirides.loginauthapi.exceptions.CnhAlreadyRegisteredException;
import br.com.unirides.loginauthapi.repositories.DriverRepository;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class DriverControllerTest {

    @InjectMocks
    private DriverController driverController;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private UserRepository userRepository;

    private MockMvc mockMvc;
    private Faker faker;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(driverController).build();
        faker = new Faker();
    }

    @Test
    public void testRegisterDriver_Success() {
        DriverRequestDTO requestDTO = new DriverRequestDTO(
                faker.internet().emailAddress(),
                "12345678900",
                LocalDate.now().minusYears(5),
                LocalDate.now().plusYears(5),
                "B"
        );

        User mockUser = new User();
        mockUser.setEmail(requestDTO.getEmail());

        when(userRepository.findByEmail(requestDTO.getEmail())).thenReturn(Optional.of(mockUser));
        when(driverRepository.save(any(Driver.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<DriverResponseDTO> response = driverController.registerDriver(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void testRegisterDriver_CnhAlreadyExists() {
        DriverRequestDTO requestDTO = new DriverRequestDTO(
                faker.internet().emailAddress(),
                "12345678900",
                LocalDate.now().minusYears(5),
                LocalDate.now().plusYears(4),
                "B"
        );

        when(driverRepository.findByNumeroCnh(requestDTO.getNumeroCnh())).thenReturn(Optional.of(new Driver()));

        CnhAlreadyRegisteredException thrown = assertThrows(
                CnhAlreadyRegisteredException.class,
                () -> driverController.registerDriver(requestDTO)
        );

        assertEquals("Já existe um motorista registrado com este numero de CNH", thrown.getMessage());
    }

    @Test
    public void testGetAllDrivers_Success() throws Exception {
        mockMvc.perform(get("/driver/get/listAll"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testUpdateDriver_Success() {
        String email = faker.internet().emailAddress();
        DriverRequestDTO requestDTO = new DriverRequestDTO(
                email,
                "98765432100",
                LocalDate.now().minusYears(4),
                LocalDate.now().plusYears(4),
                "C"
        );

        Driver mockDriver = new Driver();
        mockDriver.setUsuarioEmail(email);
        mockDriver.setNumeroCnh("98765432100");

        when(driverRepository.findDriverByUsuarioEmail(email)).thenReturn(Optional.of(mockDriver));
        when(driverRepository.save(any(Driver.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<String> response = driverController.updateDriver(email, requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Atualizado com sucesso!", response.getBody());
    }

    @Test
    public void testDeleteDriver_Success() {
        String email = faker.internet().emailAddress();
        Driver mockDriver = new Driver();
        mockDriver.setUsuarioEmail(email);

        when(driverRepository.findDriverByUsuarioEmail(email)).thenReturn(Optional.of(mockDriver));

        ResponseEntity<Void> response = driverController.deleteDriver(email);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(driverRepository, times(1)).delete(mockDriver);
    }

}
