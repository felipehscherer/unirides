package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.dto.RegisterRequestDTO;
import br.com.unirides.loginauthapi.dto.UserResponseDTO;
import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository repository; // Injetar o repositório

    // Método para buscar um usuário pelo email
    @GetMapping("/{email}")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@PathVariable String email) {
        Optional<User> userOpt = repository.findByEmail(email); // Busca o usuário

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserResponseDTO responseDTO = new UserResponseDTO(user.getName(), user.getEmail(), user.getCpf());
            return ResponseEntity.ok(responseDTO); // Retorna o usuário encontrado
        }

        return ResponseEntity.notFound().build(); // Retorna 404 se não encontrado
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = repository.findAll(); // Busca todos os usuários
        List<UserResponseDTO> responseDTOs = users.stream()
                .map(user -> new UserResponseDTO(user.getName(), user.getEmail(), user.getCpf()))
                .collect(Collectors.toList()); // Converte para UserResponseDTO

        return ResponseEntity.ok(responseDTOs); // Retorna a lista de usuários
    }

     @PutMapping("/{email}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable String email, @RequestBody RegisterRequestDTO updatedUser) {
        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setName(updatedUser.name()); // Atualiza o nome
            user.setCpf(updatedUser.cpf()); // Atualiza o CPF
            user.setPassword(updatedUser.password()); // Atualiza a senha (você pode querer codificá-la)
            
            repository.save(user); // Salva as atualizações

            UserResponseDTO responseDTO = new UserResponseDTO(user.getName(), user.getEmail(), user.getCpf());
            return ResponseEntity.ok(responseDTO);
        }

        return ResponseEntity.notFound().build(); // Retorna 404 se o usuário não for encontrado
    }

     @DeleteMapping("/{email}")
    public ResponseEntity<Void> deleteUser(@PathVariable String email) {
        Optional<User> userOpt = repository.findByEmail(email);

        if (userOpt.isPresent()) {
            repository.delete(userOpt.get()); // Deleta o usuário encontrado
            return ResponseEntity.noContent().build(); // Retorna 204 No Content
        }

        return ResponseEntity.notFound().build(); // Retorna 404 se o usuário não for encontrado
    }

}