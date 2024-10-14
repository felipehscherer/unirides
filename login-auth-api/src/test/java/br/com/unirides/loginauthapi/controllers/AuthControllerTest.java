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
import com.github.javafaker.Faker;
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

    private Faker faker;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    public void testLogin_Success() {
        User mockUser = new User();
        mockUser.setEmail(faker.internet().emailAddress());
        mockUser.setPassword("encodedPassword");
        mockUser.setName(faker.name().fullName());

        LoginRequestDTO loginRequest = new LoginRequestDTO(mockUser.getEmail(), "password");

        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(tokenService.generateToken(mockUser)).thenReturn("mockToken");

        ResponseEntity<ResponseDTO> response = authController.login(loginRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(mockUser.getEmail(), response.getBody().name());
        assertEquals("mockToken", response.getBody().token());
    }

    @Test
    public void testLogin_UserNotFound() {
        String randomEmail = faker.internet().emailAddress();
        LoginRequestDTO loginRequest = new LoginRequestDTO(randomEmail, "password");

        when(userRepository.findByEmail(randomEmail)).thenReturn(Optional.empty());

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> authController.login(loginRequest));
        assertEquals("User not found", thrown.getMessage());
    }

    @Test
    public void testLogin_InvalidPassword() {
        User mockUser = new User();
        mockUser.setEmail(faker.internet().emailAddress());
        mockUser.setPassword("encodedPassword");

        LoginRequestDTO loginRequest = new LoginRequestDTO(mockUser.getEmail(), "wrongPassword");

        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        ResponseEntity<ResponseDTO> response = authController.login(loginRequest);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testRegister_Success() {
        // Gera dados fictícios
        String cpf = "12345678909";
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        String name = faker.name().fullName();
        String telefone = faker.phoneNumber().cellPhone();
        String dataNascimento = "15/10/2000";
        String cep = "70040020";
        String cidade = faker.address().city();
        String estado = faker.address().state();
        String endereco = faker.address().streetAddress();
        int numero = faker.number().numberBetween(1, 100);
        String complemento = faker.address().secondaryAddress();

        RegisterRequestDTO request = new RegisterRequestDTO(
                name,
                email,
                cpf,
                password,
                telefone,
                dataNascimento,
                cep,
                cidade,
                estado,
                endereco,
                numero,
                complemento
        );

        // Mockar comportamento do repositório
        when(userRepository.findByCpf(cpf)).thenReturn(Optional.empty());
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(tokenService.generateToken(any(User.class))).thenReturn("token-ficticio");

        ResponseEntity<ResponseDTO> response = authController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testRegister_CpfAlreadyExists() {
        String randomEmail = faker.internet().emailAddress();
        RegisterRequestDTO registerRequest = new RegisterRequestDTO(
                faker.name().fullName(),
                randomEmail,
                "12345678900",
                "password",
                faker.phoneNumber().phoneNumber(),
                "01/01/2000",
                faker.address().zipCode(),
                faker.address().city(),
                faker.address().state(),
                faker.address().streetAddress(),
                faker.random().nextInt(1, 500),
                ""
        );

        when(userRepository.findByCpf("12345678900")).thenReturn(Optional.of(new User()));

        assertThrows(CpfAlreadyExistsException.class, () -> authController.register(registerRequest));
    }

    @Test
    public void testRegister_EmailAlreadyExists() {
        RegisterRequestDTO registerRequest = new RegisterRequestDTO(
                faker.name().fullName(),
                faker.internet().emailAddress(),
                "12345678900",
                "password",
                faker.phoneNumber().phoneNumber(),
                "01/01/2000",
                faker.address().zipCode(),
                faker.address().city(),
                faker.address().state(),
                faker.address().streetAddress(),
                faker.random().nextInt(1, 500),
                ""
        );

        when(userRepository.findByEmail(registerRequest.email())).thenReturn(Optional.of(new User()));

        assertThrows(emailAlreadyExistsException.class, () -> authController.register(registerRequest));
    }

    @Test
    void testRegister_InvalidCpf() {
        RegisterRequestDTO request = new RegisterRequestDTO(
                faker.name().fullName(),
                faker.internet().emailAddress(),
                "i", // CPF inválido
                "senha123",
                faker.phoneNumber().phoneNumber(),
                "01/01/2000",
                faker.address().zipCode(),
                faker.address().city(),
                faker.address().state(),
                faker.address().streetAddress(),
                faker.random().nextInt(1, 500),
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
                faker.name().fullName(),
                faker.internet().emailAddress(),
                "12345678909",
                "senha123",
                "1234567890",
                "31/02/2023",
                faker.address().zipCode(),
                faker.address().city(),
                faker.address().state(),
                faker.address().streetAddress(),
                faker.random().nextInt(1, 500),
                "Complemento"
        );

        assertThrows(DateTimeException.class, () -> {
            authController.register(invalidRequest);
        });
    }
}