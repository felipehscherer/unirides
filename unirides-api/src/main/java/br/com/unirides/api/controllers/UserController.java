package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.dto.user.UserDriverInfoResponseDTO;
import br.com.unirides.api.exceptions.UserNotFoundException;
import br.com.unirides.api.infra.security.SecurityUtils;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.VehicleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import br.com.unirides.api.dto.user.UserResponseDTO;
import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static br.com.unirides.api.utils.UserValidationUtils.validateName;
import static br.com.unirides.api.utils.UserValidationUtils.validatePassword;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getProfile() {
        Object principal = SecurityUtils.getAuthenticatedPrincipal();
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
        Object principal = SecurityUtils.getAuthenticatedPrincipal();

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
                return ResponseEntity.badRequest().body(null); // Email já em uso
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
        Object principal = SecurityUtils.getAuthenticatedPrincipal();

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

            if (validatePassword(newPassword)) {
                user.setPassword(passwordEncoder.encode(newPassword));
                repository.save(user);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile/details")
    public ResponseEntity<UserResponseDTO> updateDetails(@RequestBody Map<String, String> request) {
        Object principal = SecurityUtils.getAuthenticatedPrincipal();

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

            String newName = request.get("name");
            if (newName != null) {
                if (validateName(newName)) {
                    user.setName(newName);
                } else {
                    return ResponseEntity.badRequest().body(null);
                }
            }

            user.setCidade(request.getOrDefault("cidade", user.getCidade()));
            user.setEstado(request.getOrDefault("estado", user.getEstado()));
            user.setEndereco(request.getOrDefault("endereco", user.getEndereco()));

            String numeroStr = request.get("numero");
            if (numeroStr != null) {
                try {
                    user.setNumero(Integer.parseInt(numeroStr));
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().build();
                }
            }

            user.setComplemento(request.getOrDefault("complemento", user.getComplemento()));

            String newEmail = request.get("email");
            if (newEmail != null && !newEmail.equals(user.getEmail())) {
                if (repository.findByEmail(newEmail).isPresent()) {
                    return ResponseEntity.badRequest().body(null);
                }
                user.setEmail(newEmail);
            }

            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            if (currentPassword != null && newPassword != null) {
                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }
                if (validatePassword(newPassword)) {
                    user.setPassword(passwordEncoder.encode(newPassword));
                } else {
                    return ResponseEntity.badRequest().body(null);
                }
            }

            repository.save(user);

            UserResponseDTO responseDTO = new UserResponseDTO(user.getName(), user.getEmail(), user.getCpf());
            return ResponseEntity.ok(responseDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/driver-info")
    public ResponseEntity<UserDriverInfoResponseDTO> getInfoDriver() {
        Object principal = SecurityUtils.getAuthenticatedPrincipal();
        String email;

        if (principal instanceof User) {
            User user = (User) principal;
            email = user.getEmail();
        } else {
            System.out.println("Erro ao buscar usuario");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Busca o Driver e o Vehicle usando o userId
        Driver driver = driverRepository.findDriverByUsuarioEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Motorista não encontrado"));

        UserDriverInfoResponseDTO responseDTO;
        if (driverRepository.findDriverByUsuarioEmail(email).isPresent() &&
                vehicleRepository.findFirstActiveVehicleByDriverId(driver.getId()).isPresent()){
            responseDTO = new UserDriverInfoResponseDTO(true);

        }else{
            responseDTO = new UserDriverInfoResponseDTO(false);
        }

        return ResponseEntity.ok(responseDTO);
    }


    @PostMapping("/{email}/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(@PathVariable String email, @RequestParam("file") MultipartFile file) {
        try {
            // Buscar o usuário no banco de dados
            Optional<User> optionalUser = repository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body("Usuário não encontrado.");
            }

            User user = optionalUser.get();

            // Salvar a imagem no campo profileImage
            user.setProfileImage(file.getBytes());
            repository.save(user);

            return ResponseEntity.ok("Imagem salva com sucesso!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao salvar a imagem.");
        }
    }

    @Transactional
    @GetMapping("/{email}/profile-image")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable String email) {
        Optional<User> optionalUser = repository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        User user = optionalUser.get();
        byte[] image = user.getProfileImage();

        if (image == null || image.length == 0) {
            return ResponseEntity.status(404).body(null);
        }

        // Retornar a imagem como resposta
        return ResponseEntity.ok().contentType(org.springframework.http.MediaType.IMAGE_JPEG).body(image);
    }
}

