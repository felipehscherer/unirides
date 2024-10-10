package br.com.unirides.loginauthapi.controllers;

import org.springframework.security.crypto.password.PasswordEncoder;
import br.com.unirides.loginauthapi.dto.UserResponseDTO;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository repository;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getProfile() {
        // Obtain the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            // Handle the case where the user is not authenticated
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Now use the email to find the user in the repository
        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserResponseDTO responseDTO = new UserResponseDTO(user.getName(), user.getEmail(), user.getCpf());
            return ResponseEntity.ok(responseDTO);
        }

        return ResponseEntity.notFound().build();
    }


    // Endpoint para atualizar o email do usuário autenticado
    @PutMapping("/profile/email")
    public ResponseEntity<UserResponseDTO> updateEmail(@RequestBody Map<String, String> request) {
        // Obter o usuário autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            // Caso o usuário não esteja autenticado
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Usar o email para encontrar o usuário no repositório
        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String newEmail = request.get("email");

            // Verificar se o novo email já está em uso
            if (repository.findByEmail(newEmail).isPresent()) {
                return ResponseEntity.badRequest().body(null);
            }

            user.setEmail(newEmail);
            repository.save(user);

            UserResponseDTO responseDTO = new UserResponseDTO(user.getName(), user.getEmail(), user.getCpf());
            return ResponseEntity.ok(responseDTO);
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile/password")
    public ResponseEntity<Void> updatePassword(@RequestBody Map<String, String> request) {
        // Obter o usuário autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            // Caso o usuário não esteja autenticado
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Usar o email para encontrar o usuário no repositório
        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            // Verificar se a senha atual está correta
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Atualizar a senha
            user.setPassword(passwordEncoder.encode(newPassword));
            repository.save(user);

            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    // Injetar o PasswordEncoder
    @Autowired
    private PasswordEncoder passwordEncoder;
}
