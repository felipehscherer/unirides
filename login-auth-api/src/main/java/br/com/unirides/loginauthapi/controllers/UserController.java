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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            System.out.println("Erro ao buscar usuario");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserResponseDTO responseDTO = new UserResponseDTO(user.getName(), user.getEmail(), user.getCpf());
            return ResponseEntity.ok(responseDTO);
        }
        System.out.println("Usuario não encontrado");
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile/email")
    public ResponseEntity<UserResponseDTO> updateEmail(@RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            System.out.println("Erro ao atualizar email");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String newEmail = request.get("email");

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            repository.save(user);

            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile/details")
    public ResponseEntity<UserResponseDTO> updateDetails(@RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // eu to repetindo essa linha pq sim, confia que da certo e de preferencia nao tentem mudar
        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // basicamente se o que ele pegou for diferente do padrão atualiza
            user.setName(request.getOrDefault("name", user.getName()));
            user.setCidade(request.getOrDefault("cidade", user.getCidade()));
            user.setEstado(request.getOrDefault("estado", user.getEstado()));
            user.setEndereco(request.getOrDefault("endereco", user.getEndereco()));

            // Atualizar número e complemento, se aplicável
            String numeroStr = request.get("numero");
            if (numeroStr != null) {
                try {
                    user.setNumero(Integer.parseInt(numeroStr));
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().build(); // Número inválido
                }
            }

            user.setComplemento(request.getOrDefault("complemento", user.getComplemento()));

            // Atualizar email se fornecido e se não estiver em uso por outro usuário
            String newEmail = request.get("email");
            if (newEmail != null && !newEmail.equals(user.getEmail())) {
                if (repository.findByEmail(newEmail).isPresent()) {
                    return ResponseEntity.badRequest().build(); // Email já em uso
                }
                user.setEmail(newEmail);
            }

            // Atualizar senha se fornecido o currentPassword e newPassword
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            if (currentPassword != null && newPassword != null) {
                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Senha atual incorreta
                }
                user.setPassword(passwordEncoder.encode(newPassword));
            }

            // Salvar as alterações
            repository.save(user);

            UserResponseDTO responseDTO = new UserResponseDTO(user.getName(), user.getEmail(), user.getCpf());
            return ResponseEntity.ok(responseDTO);
        }

        return ResponseEntity.notFound().build();
    }
}
