package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.UserResponseDTO;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private PasswordEncoder passwordEncoder;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContext securityContext = mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        faker = new Faker();
    }

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
        when(userRepository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

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
        when(userRepository.findByEmail(fakeEmail)).thenReturn(Optional.empty());

        ResponseEntity<UserResponseDTO> response = userController.getProfile();

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    public void testUpdateEmail_Success() {
        User mockUser = new User();
        String oldEmail = faker.internet().emailAddress();
        String newEmail = faker.internet().emailAddress();

        mockUser.setEmail(oldEmail);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userRepository.findByEmail(oldEmail)).thenReturn(Optional.of(mockUser));
        when(userRepository.findByEmail(newEmail)).thenReturn(Optional.empty());

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
        when(userRepository.findByEmail(oldEmail)).thenReturn(Optional.of(mockUser));
        when(userRepository.findByEmail(inUseEmail)).thenReturn(Optional.of(new User()));

        ResponseEntity<UserResponseDTO> response = userController.updateEmail(Map.of("email", inUseEmail));

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    public void testUpdatePassword_Success() {
        User mockUser = new User();
        String fakeEmail = faker.internet().emailAddress();
        String oldPassword = faker.internet().password();
        String newPassword = faker.internet().password();

        mockUser.setEmail(fakeEmail);
        mockUser.setPassword(oldPassword);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userRepository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

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
        when(userRepository.findByEmail(fakeEmail)).thenReturn(Optional.of(mockUser));

        when(passwordEncoder.matches(wrongPassword, mockUser.getPassword())).thenReturn(false);

        ResponseEntity<Void> response = userController.updatePassword(Map.of("currentPassword", wrongPassword, "newPassword", faker.internet().password()));

        assertEquals(401, response.getStatusCodeValue());
    }
}
