//package br.com.unirides.api.controllers;
//
//import br.com.unirides.api.domain.driver.Driver;
//import br.com.unirides.api.domain.driver.Vehicle;
//import br.com.unirides.api.domain.ride.Ride;
//import br.com.unirides.api.domain.user.User;
//import br.com.unirides.api.repository.DriverRepository;
//import br.com.unirides.api.repository.RideRepository;
//import br.com.unirides.api.repository.UserRepository;
//import br.com.unirides.api.repository.VehicleRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import java.time.LocalDateTime;
//import java.util.*;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//class RideControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Mock
//    private RideRepository rideRepository;
//
//    @Mock
//    private DriverRepository driverRepository;
//
//    @Mock
//    private VehicleRepository vehicleRepository;
//
//    @Mock
//    private UserRepository userRepository;
//
//    @InjectMocks
//    private RideController rideController;
//
//    private ObjectMapper objectMapper;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        mockMvc = MockMvcBuilders.standaloneSetup(rideController).build();
//        objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new JavaTimeModule()); // Registro do módulo para suportar LocalDateTime
//    }
//
//    @Test
//    void testCreateRide_Success() throws Exception {
//        // Configurações
//        UUID driverId = UUID.randomUUID();
//        UUID vehicleId = UUID.randomUUID();
//        UUID passengerId = UUID.randomUUID();
//
//        Driver driver = new Driver();
//        driver.setId(driverId);
//
//        Vehicle vehicle = new Vehicle();
//        vehicle.setId(vehicleId);
//        vehicle.setDriver(driver);
//
//        User passenger = new User();
//        passenger.setId(passengerId);
//
//        Set<UUID> passengerIds = new HashSet<>();
//        passengerIds.add(passengerId);
//
//        CreateRideDTO rideDTO = new CreateRideDTO();
//        rideDTO.setDriverId(driverId);
//        rideDTO.setVehicleId(vehicleId);
//        rideDTO.setPassengerIds(passengerIds);
//        rideDTO.setParadas(new ArrayList<>());
//        rideDTO.setLugaresDisponiveis(4);
//        rideDTO.setHorarioPartida(LocalDateTime.now());
//        rideDTO.setHorarioChegada(LocalDateTime.now().plusHours(1));
//
//        when(driverRepository.findById(driverId)).thenReturn(Optional.of(driver));
//        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
//        when(userRepository.findById(passengerId.toString())).thenReturn(Optional.of(passenger));
//        when(rideRepository.save(any(Ride.class))).thenAnswer(i -> i.getArgument(0));
//
//        // Executa a requisição
//        mockMvc.perform(post("/rides")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(rideDTO)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.driver.id").value(driverId.toString()))
//                .andExpect(jsonPath("$.vehicle.id").value(vehicleId.toString()));
//
//        // Verificações
//        verify(rideRepository).save(any(Ride.class));
//    }
//
//    @Test
//    void testCreateRide_DriverNotFound() throws Exception {
//        // ID do motorista que não existe
//        UUID driverId = UUID.randomUUID();
//        UUID vehicleId = UUID.randomUUID();
//
//        CreateRideDTO rideDTO = new CreateRideDTO();
//        rideDTO.setDriverId(driverId);
//        rideDTO.setVehicleId(vehicleId);
//        rideDTO.setPassengerIds(new HashSet<>());
//
//        when(driverRepository.findById(driverId)).thenReturn(Optional.empty());
//
//        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(new Vehicle()));
//
//        mockMvc.perform(post("/rides")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(rideDTO)))
//                .andExpect(status().isNotFound()); // Espera que o status seja 404
//    }
//
//    @Test
//    void testCreateRide_VehicleNotFound() throws Exception {
//        // Configurações
//        UUID driverId = UUID.randomUUID();
//        UUID vehicleId = UUID.randomUUID();
//        CreateRideDTO rideDTO = new CreateRideDTO();
//        rideDTO.setDriverId(driverId);
//        rideDTO.setVehicleId(vehicleId);
//
//        when(driverRepository.findById(driverId)).thenReturn(Optional.of(new Driver()));
//
//        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());
//
//        mockMvc.perform(post("/rides")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(rideDTO)))
//                .andExpect(status().isNotFound()); // Espera que o status seja 404
//
//        verify(rideRepository, never()).save(any(Ride.class));
//    }
//
//}
//
