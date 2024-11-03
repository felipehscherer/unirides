package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.ride.Ride;
import br.com.unirides.api.domain.ride.RideStatus;
import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.ride.RideCreationDTO;
import br.com.unirides.api.dto.ride.RideJoinDTO;
import br.com.unirides.api.infra.security.TokenService;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.RideRepository;
import br.com.unirides.api.repository.UserRepository;
import br.com.unirides.api.repository.VehicleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
public class RideControllerTest {

    @Autowired
    private MockMvc mockMvc;


    @InjectMocks
    private RideController rideController;

    @Mock
    private RideRepository rideRepository;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private UserRepository userRepository;

    @MockBean
    private TokenService tokenService;

    private Driver driver;
    private Vehicle vehicle;
    private RideCreationDTO rideCreationDTO;
    private RideJoinDTO rideJoinDTO;
    private String token;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        driver = new Driver(); // Inicialize o driver com dados necessários
        vehicle = new Vehicle(); // Inicialize o veículo com dados necessários

        rideCreationDTO = new RideCreationDTO();
        rideCreationDTO.setDriverId(UUID.randomUUID());
        rideCreationDTO.setVehicleId(UUID.randomUUID());
        rideCreationDTO.setDestinoInicial("São Paulo");
        rideCreationDTO.setDestinoFinal("Rio de Janeiro");
        rideCreationDTO.setLugaresDisponiveis(3);
        rideCreationDTO.setHorarioPartida(LocalDateTime.now());
        rideCreationDTO.setHorarioChegada(LocalDateTime.now().plusHours(5));

        rideJoinDTO = new RideJoinDTO();
        rideJoinDTO.setPassengerId(UUID.randomUUID());

        token = "Bearer mock_token";

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        mockMvc = MockMvcBuilders
                .standaloneSetup(rideController)
                .build();
    }

    @Test
    void testCreateRide_Success() {
        when(driverRepository.findById(any(UUID.class))).thenReturn(Optional.of(driver));
        when(vehicleRepository.findById(any(UUID.class))).thenReturn(Optional.of(vehicle));

        ResponseEntity<?> response = rideController.createRide(rideCreationDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        Ride ride = (Ride) response.getBody();
        assertEquals("São Paulo", ride.getDestinoInicial());
        assertEquals("Rio de Janeiro", ride.getDestinoFinal());
        verify(rideRepository, times(1)).save(any(Ride.class));
    }

    @Test
    void testCreateRide_DriverNotFound() {
        when(driverRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        ResponseEntity<?> response = rideController.createRide(rideCreationDTO);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Motorista não encontrado", response.getBody());
        verify(rideRepository, times(0)).save(any(Ride.class));
    }

    @Test
    void testCreateRide_VehicleNotFound() {
        when(driverRepository.findById(any(UUID.class))).thenReturn(Optional.of(driver));
        when(vehicleRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        ResponseEntity<?> response = rideController.createRide(rideCreationDTO);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Veículo não encontrado", response.getBody());
        verify(rideRepository, times(0)).save(any(Ride.class));
    }
    @Test
    void testJoinRide_Success() {
        Ride ride = new Ride();
        ride.setStatus(RideStatus.ABERTA);
        ride.setLugaresDisponiveis(3);
        ride.setPassengers(new HashSet<>()); // Use um HashSet para passageiros

        when(rideRepository.findById(any(UUID.class))).thenReturn(Optional.of(ride));
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(new User()));

        ResponseEntity<?> response = rideController.joinRide(UUID.randomUUID(), rideJoinDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertFalse(ride.getPassengers().contains(response.getBody()));
        verify(rideRepository, times(1)).save(ride);
    }
    @Test
    void testJoinRide_RideNotFound() {
        UUID rideId = UUID.randomUUID();
        when(rideRepository.findById(rideId)).thenReturn(Optional.empty());

        RideJoinDTO joinDTO = new RideJoinDTO();
        joinDTO.setPassengerId(UUID.randomUUID());

        ResponseEntity<?> response = rideController.joinRide(rideId, joinDTO);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Carona não encontrada", response.getBody());
        verify(rideRepository, times(0)).save(any(Ride.class));
    }

    @Test
    void testJoinRide_NoAvailableSeats() {
        Ride ride = new Ride();
        ride.setLugaresDisponiveis(0);
        when(rideRepository.findById(any(UUID.class))).thenReturn(Optional.of(ride));
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(new User()));

        RideJoinDTO joinDTO = new RideJoinDTO();
        joinDTO.setPassengerId(UUID.randomUUID());

        ResponseEntity<?> response = rideController.joinRide(UUID.randomUUID(), joinDTO);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Não é possível ingressar em uma carona que não está aberta", response.getBody());
    }

    @Test
    void testCancelRide_Success() {
        UUID rideId = UUID.randomUUID();
        UUID passengerId = UUID.randomUUID();
        Ride ride = new Ride();
        User passenger = new User();
        ride.getPassengers().add(passenger);
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));
        when(userRepository.findById(passengerId)).thenReturn(Optional.of(passenger));

        ResponseEntity<?> response = rideController.cancelRide(rideId, passengerId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Passageiro removido da carona com sucesso", response.getBody());
        verify(rideRepository, times(1)).save(ride);
    }

    @Test
    void testCancelRide_RideNotFound() {
        UUID rideId = UUID.randomUUID();
        UUID passengerId = UUID.randomUUID();
        when(rideRepository.findById(rideId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = rideController.cancelRide(rideId, passengerId);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Carona não encontrada", response.getBody());
        verify(rideRepository, times(0)).save(any(Ride.class));
    }

    @Test
    void testCancelRide_PassengerNotFound() {
        UUID rideId = UUID.randomUUID();
        UUID passengerId = UUID.randomUUID();
        Ride ride = new Ride();
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));
        when(userRepository.findById(passengerId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = rideController.cancelRide(rideId, passengerId);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Passageiro não encontrado", response.getBody());
        verify(rideRepository, times(0)).save(any(Ride.class));
    }

    @WithMockUser(roles = "USER")
    @Test
    public void testCreateRide_SuccessHTTPS() throws Exception {
        // Dados de teste
        UUID driverId = UUID.randomUUID();
        UUID vehicleId = UUID.randomUUID();
        RideCreationDTO rideCreationDTO = new RideCreationDTO();
        rideCreationDTO.setDriverId(driverId);
        rideCreationDTO.setVehicleId(vehicleId);
        rideCreationDTO.setDestinoInicial("A");
        rideCreationDTO.setDestinoFinal("B");
        rideCreationDTO.setLugaresDisponiveis(3);
        rideCreationDTO.setHorarioPartida(LocalDateTime.now());
        rideCreationDTO.setHorarioChegada(LocalDateTime.now().plusHours(1));

        // Mock dos repositórios
        Driver driver = new Driver();
        Vehicle vehicle = new Vehicle();
        Ride ride = new Ride();

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(driver));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(rideRepository.save(any(Ride.class))).thenReturn(ride);

        // Perform the POST request
        mockMvc.perform(post("/rides/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rideCreationDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.destinoInicial").value("A"))
                .andExpect(jsonPath("$.destinoFinal").value("B"));
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testJoinRide_SuccessHTTPS() throws Exception {
        UUID rideId = UUID.randomUUID();
        UUID passengerId = UUID.randomUUID();

        // Configurar o comportamento do repositório
        Ride ride = new Ride();
        ride.setId(rideId);
        ride.setStatus(RideStatus.ABERTA);
        ride.setLugaresDisponiveis(3);
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));

        User passenger = new User();
        passenger.setId(passengerId);
        when(userRepository.findById(passengerId)).thenReturn(Optional.of(passenger));

        RideJoinDTO rideJoinDTO = new RideJoinDTO();
        rideJoinDTO.setPassengerId(passengerId);

        mockMvc.perform(post("/rides/{rideId}/join", rideId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rideJoinDTO)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testCancelRide_SuccessHTTPS() throws Exception {
        UUID rideId = UUID.randomUUID();
        UUID passengerId = UUID.randomUUID();

        // Configurar o comportamento do repositório
        Ride ride = new Ride();
        ride.setId(rideId);
        User passenger = new User();
        passenger.setId(passengerId);
        ride.getPassengers().add(passenger);
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));
        when(userRepository.findById(passengerId)).thenReturn(Optional.of(passenger));

        mockMvc.perform(delete("/rides/{rideId}/passengers/{passengerId}", rideId, passengerId))
                .andExpect(status().isOk())
                .andExpect(content().string("Passageiro removido da carona com sucesso"));
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testSearchRides_SuccessHTTPS() throws Exception {
        String destino = "A"; // Destino de busca

        // Configurar o comportamento do repositório
        List<Ride> rides = new ArrayList<>();
        Ride ride = new Ride();
        ride.setDestinoInicial("A");
        ride.setDestinoFinal("B");
        rides.add(ride);
        when(rideRepository.findByStatusAndDestinoInicialContainingIgnoreCaseOrStatusAndDestinoFinalContainingIgnoreCase(
                RideStatus.ABERTA, destino, RideStatus.ABERTA, destino)).thenReturn(rides);

        Map<String, String> searchParams = new HashMap<>();
        searchParams.put("destino", destino);

        mockMvc.perform(post("/rides/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(searchParams)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].destinoInicial").value("A"));
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testJoinRide_NotFound() throws Exception {
        UUID rideId = UUID.randomUUID(); // ID de carona que não existe
        UUID passengerId = UUID.randomUUID(); // Use um ID de passageiro existente

        RideJoinDTO rideJoinDTO = new RideJoinDTO();
        rideJoinDTO.setPassengerId(passengerId);

        mockMvc.perform(post("/rides/{rideId}/join", rideId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rideJoinDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Carona não encontrada"));
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testCancelRide_PassengerNotFoundHTTPS() throws Exception {
        UUID rideId = UUID.randomUUID();
        UUID passengerId = UUID.randomUUID();

        Ride ride = new Ride();
        ride.setId(rideId);
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));

        mockMvc.perform(delete("/rides/{rideId}/passengers/{passengerId}", rideId, passengerId))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Passageiro não encontrado"));
    }
}
