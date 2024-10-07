package br.com.unirides.loginauthapi.controllers;

import br.com.unirides.loginauthapi.domain.user.User;
import br.com.unirides.loginauthapi.dto.LoginRequestDTO;
import br.com.unirides.loginauthapi.dto.RegisterRequestDTO;
import br.com.unirides.loginauthapi.dto.ResponseDTO;
import br.com.unirides.loginauthapi.exceptions.CpfAlreadyExistsException;
import br.com.unirides.loginauthapi.exceptions.emailAlreadyExistsException;
import br.com.unirides.loginauthapi.infra.security.TokenService;
import br.com.unirides.loginauthapi.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO body){
        User user = this.repository.findByEmail(body.email()).orElseThrow(() -> new RuntimeException("User not found"));
        if(passwordEncoder.matches(body.password(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new ResponseDTO(user.getName(), token));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body){
        if (this.repository.findByCpf(body.cpf()).isPresent()) {
            throw new CpfAlreadyExistsException("Usuário com este CPF já cadastrado!");
        } else if (this.repository.findByEmail(body.email()).isPresent()) {
            throw new emailAlreadyExistsException("E-mail já cadastrado!");
        }else{
            User newUser = new User();
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setName(body.name());
            newUser.setCpf(body.cpf());
            newUser.setTelefone(body.telefone());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate dataFormatada = LocalDate.parse(body.dataNascimento(), formatter);
            newUser.setDataNascimento(dataFormatada);

            newUser.setCep(body.cep());
            newUser.setCidade(body.cidade());
            newUser.setEstado(body.estado());
            newUser.setEndereco(body.endereco());
            newUser.setNumero(body.numero());
            newUser.setComplemento(body.complemento());
            this.repository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new ResponseDTO(newUser.getName(), token));
        }
    }
}
