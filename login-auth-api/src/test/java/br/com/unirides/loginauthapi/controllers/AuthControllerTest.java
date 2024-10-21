package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.user.LoginRequestDTO;
import br.com.unirides.loginauthapi.dto.user.RegisterRequestDTO;
import br.com.unirides.loginauthapi.dto.user.ResponseDTO;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.DateTimeException;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    private MockMvc mockMvc;
    private Faker faker;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        faker = new Faker();
    }

    // Testes de Login
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

    // Testes de Registro
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

    // Testes de Requisição HTTP para Login
    @Test
    public void testLogin_Success_HTTP() throws Exception {
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setPassword(password);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(password, mockUser.getPassword())).thenReturn(true);
        when(tokenService.generateToken(mockUser)).thenReturn("fake-token");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("{\"email\": \"" + email + "\", \"token\": \"fake-token\"}"));
    }

    @Test
    public void testLogin_UserNotFound_HTTP() throws Exception {
        // Simula que o repositório retornará um Optional vazio, indicando que o usuário não foi encontrado
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Realiza a requisição de login
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"email\": \"nonexistent@example.com\", \"password\": \"password\" }"))
                .andExpect(status().isBadRequest())  // Espera um status 400
                .andExpect(content().string(""));  // Verifica que não há conteúdo na resposta
    }







    // Testes de Requisição HTTP para Registro
    @Test
    public void testRegister_Success_HTTP() throws Exception {
        String cpf = "12345678909";
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        String name = faker.name().fullName();

        RegisterRequestDTO request = new RegisterRequestDTO(name, email, cpf, password,
                faker.phoneNumber().phoneNumber(), "01/01/2000", faker.address().zipCode(),
                faker.address().city(), faker.address().state(), faker.address().streetAddress(),
                faker.random().nextInt(1, 500), "");

        when(userRepository.findByCpf(cpf)).thenReturn(Optional.empty());
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + name + "\",\"email\":\"" + email + "\",\"cpf\":\"" + cpf + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testRegister_CpfAlreadyExists_HTTP() throws Exception {
        String cpf = "12345678909";
        String email = faker.internet().emailAddress();
        RegisterRequestDTO request = new RegisterRequestDTO(faker.name().fullName(), email, cpf, "senha123",
                faker.phoneNumber().phoneNumber(), "01/01/2000", faker.address().zipCode(),
                faker.address().city(), faker.address().state(), faker.address().streetAddress(),
                faker.random().nextInt(1, 500), "");

        // Simula a resposta do repositório indicando que o CPF já existe
        when(userRepository.findByCpf(cpf)).thenReturn(Optional.of(new User()));

        // Executa a requisição de registro e verifica se o status e a mensagem de erro estão corretos
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + request.name() + "\",\"email\":\"" + email + "\",\"cpf\":\"" + cpf + "\",\"password\":\"" + request.password() + "\"}"))
                .andExpect(status().isConflict())  // Espera status 409 Conflict
                .andExpect(content().string(containsString("Usuário com este CPF já cadastrado!"))); // Verifica a mensagem de erro
    }



    @Test
    public void testRegister_EmailAlreadyExists_HTTP() throws Exception {
        String cpf = "12345678909";
        String email = faker.internet().emailAddress();
        RegisterRequestDTO request = new RegisterRequestDTO(faker.name().fullName(), email, cpf, "senha123",
                faker.phoneNumber().phoneNumber(), "01/01/2000", faker.address().zipCode(),
                faker.address().city(), faker.address().state(), faker.address().streetAddress(),
                faker.random().nextInt(1, 500), "");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + request.name() + "\",\"email\":\"" + email + "\",\"cpf\":\"" + cpf + "\",\"password\":\"" + request.password() + "\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testRegister_InvalidCpf_HTTP() throws Exception {
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

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + request.name() + "\",\"email\":\"" + request.email() + "\",\"cpf\":\"i\",\"password\":\"" + request.password() + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("CPF inválido"))); // Verifica a mensagem de erro
    }


    @Test
    public void testRegister_InvalidData_HTTP() throws Exception {
        RegisterRequestDTO invalidRequest = new RegisterRequestDTO(
                faker.name().fullName(),
                faker.internet().emailAddress(),
                "12345678909",
                "senha123",
                faker.phoneNumber().phoneNumber(),
                "31/02/2023",
                faker.address().zipCode(),
                faker.address().city(),
                faker.address().state(),
                faker.address().streetAddress(),
                faker.random().nextInt(1, 500),
                "Complemento"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + invalidRequest.name() + "\",\"email\":\"" + invalidRequest.email() + "\",\"cpf\":\"" + invalidRequest.cpf() + "\",\"password\":\"" + invalidRequest.password() + "\"}"))
                .andExpect(status().isBadRequest());
    }
}
