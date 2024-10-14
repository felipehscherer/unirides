package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.LoginRequestDTO;
import br.com.unirides.loginauthapi.dto.RegisterRequestDTO;
import br.com.unirides.loginauthapi.dto.ResponseDTO;
import br.com.unirides.loginauthapi.exceptions.CpfAlreadyExistsException;
import br.com.unirides.loginauthapi.exceptions.CpfInvalidoException;
import br.com.unirides.loginauthapi.exceptions.emailAlreadyExistsException;
import br.com.unirides.loginauthapi.infra.security.TokenService;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.DateTimeException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLogin_Success() {
        User mockUser = new User();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setName("Test User");

        LoginRequestDTO loginRequest = new LoginRequestDTO("test@example.com", "password");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(tokenService.generateToken(mockUser)).thenReturn("mockToken");

        ResponseEntity<ResponseDTO> response = authController.login(loginRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals("test@example.com", response.getBody().name());
        assertEquals("mockToken", response.getBody().token());
    }

    @Test
    public void testLogin_UserNotFound() {

        LoginRequestDTO loginRequest = new LoginRequestDTO("notfound@example.com", "password");

        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> authController.login(loginRequest));
        assertEquals("User not found", thrown.getMessage());
    }

    @Test
    public void testLogin_InvalidPassword() {
        // Arrange
        User mockUser = new User();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPassword");

        LoginRequestDTO loginRequest = new LoginRequestDTO("test@example.com", "wrongPassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        ResponseEntity<ResponseDTO> response = authController.login(loginRequest);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testRegister_Success() {
        RegisterRequestDTO request = new RegisterRequestDTO(
                "Nome Exemplo",
                "email@exemplo.com",
                "12345678909",
                "senha123",
                "123456789",
                "01/01/2000",
                "01001-000",
                "Cidade Exemplo",
                "Estado Exemplo",
                "Endereço Exemplo",
                123,
                "Complemento Exemplo"
        );

        ResponseEntity response = authController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }



    @Test
    public void testRegister_CpfAlreadyExists() {
        RegisterRequestDTO registerRequest = new RegisterRequestDTO(
                "Test User",
                "test@example.com",
                "12345678900",
                "password",
                "123456789",
                "01/01/2000",
                "12345678",
                "City",
                "State",
                "Street",
                123,
                ""
        );

        when(userRepository.findByCpf("12345678900")).thenReturn(Optional.of(new User()));

        assertThrows(CpfAlreadyExistsException.class, () -> authController.register(registerRequest));
    }

    @Test
    public void testRegister_EmailAlreadyExists() {
        // Arrange
        RegisterRequestDTO registerRequest = new RegisterRequestDTO(
                "Test User",
                "test@example.com",
                "12345678900",
                "password",
                "123456789",
                "01/01/2000",
                "12345678",
                "City",
                "State",
                "Street",
                123,
                ""
        );

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new User()));

        // Act & Assert
        assertThrows(emailAlreadyExistsException.class, () -> authController.register(registerRequest));
    }

    @Test
    void testRegister_InvalidCpf() {
        RegisterRequestDTO request = new RegisterRequestDTO(
                "Nome Exemplo",
                "email@exemplo.com",
                "i", // CPF inválido
                "senha123",
                "123456789",
                "01/01/2000",
                "12345678",
                "Cidade Exemplo",
                "Estado Exemplo",
                "Endereço Exemplo",
                123,
                "Complemento Exemplo"
        );
        CpfInvalidoException exception = assertThrows(CpfInvalidoException.class, () -> {
            authController.register(request);
        });
        String expectedMessage = "CPF inválido";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
    }



    @Test
    void testRegister_InvalidData() {
        RegisterRequestDTO invalidRequest = new RegisterRequestDTO(
                "Test User",
                "test@example.com",
                "12345678909",
                "senha123",
                "1234567890",
                "31/02/2023",
                "12345678",
                "Cidade",
                "Estado",
                "Endereço",
                123,
                "Complemento"
        );
        assertThrows(DateTimeException.class, () -> {
            authController.register(invalidRequest);
        });
    }


}
