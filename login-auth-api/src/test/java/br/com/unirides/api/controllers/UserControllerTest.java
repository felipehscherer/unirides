package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.user.UserResponseDTO;
import br.com.unirides.api.repositories.UserRepository;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserRepository repository;

    @Mock
    private Authentication authentication;

    @Mock
    private PasswordEncoder passwordEncoder;

    private MockMvc mockMvc;
    private Faker faker;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContext securityContext = mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        faker = new Faker();
    }

    // Testes de Método
    @Test
    public void testGetProfile_UserFound() {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String fakeName = faker.name().fullName();
        String fakeCpf = faker.idNumber().valid();

        mockUser.setEmail(fakeEmail);
        mockUser.setName(fakeName);
        mockUser.setCpf(fakeCpf);

        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

        ResponseEntity<UserResponseDTO> response = userController.getProfile();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(fakeName, response.getBody().name());
    }

    @Test
    public void testGetProfile_UserNotFound() {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();

        mockUser.setEmail(fakeEmail);

        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.empty());

        ResponseEntity<UserResponseDTO> response = userController.getProfile();

        assertEquals(404, response.getStatusCodeValue());
    }

    // Testes de Atualização de Email
    @Test
    public void testUpdateEmail_Success() {
        User mockUser = new User();
        String oldEmail = faker.internet().emailAddress();
        String newEmail = faker.internet().emailAddress();

        mockUser.setEmail(oldEmail);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(oldEmail)).thenReturn(Optional.of(mockUser));
        when(repository.findByEmail(newEmail)).thenReturn(Optional.empty());

        ResponseEntity<UserResponseDTO> response = userController.updateEmail(Map.of("email", newEmail));

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(newEmail, mockUser.getEmail());
    }

    @Test
    public void testUpdateEmail_EmailInUse() {
        User mockUser = new User();
        String oldEmail = faker.internet().emailAddress();
        String inUseEmail = faker.internet().emailAddress();

        mockUser.setEmail(oldEmail);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(oldEmail)).thenReturn(Optional.of(mockUser));
        when(repository.findByEmail(inUseEmail)).thenReturn(Optional.of(new User()));

        ResponseEntity<UserResponseDTO> response = userController.updateEmail(Map.of("email", inUseEmail));

        assertEquals(400, response.getStatusCodeValue());
    }

    // Testes de Atualização de Senha
    @Test
    public void testUpdatePassword_Success() {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String oldPassword = faker.internet().password();
        String newPassword = faker.internet().password();

        mockUser.setEmail(fakeEmail);
        mockUser.setPassword(oldPassword);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

        when(passwordEncoder.matches(oldPassword, mockUser.getPassword())).thenReturn(true);

        ResponseEntity<Void> response = userController.updatePassword(Map.of("currentPassword", oldPassword, "newPassword", newPassword));

        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    public void testUpdatePassword_CurrentPasswordIncorrect() {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String oldPassword = faker.internet().password();
        String wrongPassword = faker.internet().password();

        mockUser.setEmail(fakeEmail);
        mockUser.setPassword(oldPassword);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

        when(passwordEncoder.matches(wrongPassword, mockUser.getPassword())).thenReturn(false);

        ResponseEntity<Void> response = userController.updatePassword(Map.of("currentPassword", wrongPassword, "newPassword", faker.internet().password()));

        assertEquals(401, response.getStatusCodeValue());
    }

    // Testes de Atualização de Detalhes
    @Test
    public void testUpdateDetails_Success() {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String fakeName = faker.name().fullName();
        String fakeCidade = faker.address().city();
        String fakeEstado = faker.address().state();
        String fakeEndereco = faker.address().fullAddress();
        String fakeComplemento = faker.lorem().sentence();
        int fakeNumero = faker.number().numberBetween(1, 100);

        mockUser.setEmail(fakeEmail);
        mockUser.setName(fakeName);
        mockUser.setCidade(fakeCidade);
        mockUser.setEstado(fakeEstado);
        mockUser.setEndereco(fakeEndereco);
        mockUser.setNumero(fakeNumero);
        mockUser.setComplemento(fakeComplemento);

        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

        Map<String, String> requestBody = Map.of(
                "name", "Novo Nome",
                "cidade", "Nova Cidade",
                "estado", "Novo Estado",
                "endereco", "Novo Endereço",
                "numero", String.valueOf(fakeNumero),
                "complemento", "Novo Complemento"
        );

        ResponseEntity<UserResponseDTO> response = userController.updateDetails(requestBody);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Novo Nome", mockUser.getName());
        assertEquals("Nova Cidade", mockUser.getCidade());
        assertEquals("Novo Estado", mockUser.getEstado());
        assertEquals("Novo Endereço", mockUser.getEndereco());
        assertEquals(fakeNumero, mockUser.getNumero());
        assertEquals("Novo Complemento", mockUser.getComplemento());
    }

    @Test
    public void testUpdateDetails_UserNotFound() {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();

        mockUser.setEmail(fakeEmail);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.empty());

        ResponseEntity<UserResponseDTO> response = userController.updateDetails(Map.of());

        assertEquals(404, response.getStatusCodeValue());
    }

    // Testes de Requisição
    @Test
    public void testGetProfile_RequestSuccess() throws Exception {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String fakeName = faker.name().fullName();
        String fakeCpf = faker.idNumber().valid();

        mockUser.setEmail(fakeEmail);
        mockUser.setName(fakeName);
        mockUser.setCpf(fakeCpf);

        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

        mockMvc.perform(get("/user/profile")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetProfile_RequestUnauthorized() throws Exception {
        when(authentication.getPrincipal()).thenReturn(new Object());

        mockMvc.perform(get("/user/profile")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testUpdateEmail_RequestSuccess() throws Exception {
        User mockUser = new User();
        String oldEmail = faker.internet().emailAddress();
        String newEmail = faker.internet().emailAddress();

        mockUser.setEmail(oldEmail);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(oldEmail)).thenReturn(Optional.of(mockUser));
        when(repository.findByEmail(newEmail)).thenReturn(Optional.empty());

        mockMvc.perform(put("/user/profile/email")
                .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + newEmail + "\"}"))
                .andExpect(status().isOk());

        assertEquals(newEmail, mockUser.getEmail());
    }

    @Test
    public void testUpdateEmail_RequestEmailInUse() throws Exception {
        User mockUser = new User();
        String oldEmail = faker.internet().emailAddress();
        String inUseEmail = faker.internet().emailAddress();

        mockUser.setEmail(oldEmail);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(oldEmail)).thenReturn(Optional.of(mockUser));
        when(repository.findByEmail(inUseEmail)).thenReturn(Optional.of(new User()));

        mockMvc.perform(put("/user/profile/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + inUseEmail + "\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUpdatePassword_RequestSuccess() throws Exception {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String oldPassword = faker.internet().password();
        String newPassword = faker.internet().password();

        mockUser.setEmail(fakeEmail);
        mockUser.setPassword(oldPassword);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(oldPassword, mockUser.getPassword())).thenReturn(true);

        mockMvc.perform(put("/user/profile/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"" + oldPassword + "\",\"newPassword\":\"" + newPassword + "\"}"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testUpdatePassword_RequestCurrentPasswordIncorrect() throws Exception {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String oldPassword = faker.internet().password();
        String wrongPassword = faker.internet().password();

        mockUser.setEmail(fakeEmail);
        mockUser.setPassword(oldPassword);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(wrongPassword, mockUser.getPassword())).thenReturn(false);

        mockMvc.perform(put("/user/profile/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"" + wrongPassword + "\",\"newPassword\":\"" + faker.internet().password() + "\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testUpdateDetails_RequestSuccess() throws Exception {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String fakeName = faker.name().fullName();
        String fakeCidade = faker.address().city();
        String fakeEstado = faker.address().state();
        String fakeEndereco = faker.address().fullAddress();
        String fakeComplemento = faker.lorem().sentence();
        int fakeNumero = faker.number().numberBetween(1, 100);

        mockUser.setEmail(fakeEmail);
        mockUser.setName(fakeName);
        mockUser.setCidade(fakeCidade);
        mockUser.setEstado(fakeEstado);
        mockUser.setEndereco(fakeEndereco);
        mockUser.setNumero(fakeNumero);
        mockUser.setComplemento(fakeComplemento);

        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

        mockMvc.perform(put("/user/profile/details")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Novo Nome\",\"cidade\":\"Nova Cidade\",\"estado\":\"Novo Estado\",\"endereco\":\"Novo Endereço\",\"numero\":\"" + fakeNumero + "\",\"complemento\":\"Novo Complemento\"}"))
                .andExpect(status().isOk());

        assertEquals("Novo Nome", mockUser.getName());
        assertEquals("Nova Cidade", mockUser.getCidade());
        assertEquals("Novo Estado", mockUser.getEstado());
        assertEquals("Novo Endereço", mockUser.getEndereco());
        assertEquals(fakeNumero, mockUser.getNumero());
        assertEquals("Novo Complemento", mockUser.getComplemento());
    }

    @Test
    public void testUpdateDetails_RequestUserNotFound() throws Exception {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();

        mockUser.setEmail(fakeEmail);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(repository.findByEmail(fakeEmail)).thenReturn(Optional.empty());

        mockMvc.perform(put("/user/profile/details")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Novo Nome\"}"))
                .andExpect(status().isNotFound());
    }
}


