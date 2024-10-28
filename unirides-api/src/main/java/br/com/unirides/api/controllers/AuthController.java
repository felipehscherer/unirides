package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.user.LoginRequestDTO;
import br.com.unirides.api.dto.user.RegisterRequestDTO;
import br.com.unirides.api.dto.user.ResponseDTO;
import br.com.unirides.api.exceptions.*;
import br.com.unirides.api.infra.security.TokenService;
import br.com.unirides.api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        User user = this.repository.findByEmail(body.email()).orElseThrow(() -> new UserNotFoundException("User not found"));
        if(passwordEncoder.matches(body.password(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new ResponseDTO(user.getEmail(), token));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body){
        User newUser = new User();
        boolean responseOk = true;
        if (this.repository.findByCpf(body.cpf()).isPresent()) {
            throw new CpfAlreadyExistsException("Usuário com este CPF já cadastrado!");
        } else if (this.repository.findByEmail(body.email()).isPresent()) {
            throw new emailAlreadyExistsException("E-mail já cadastrado!");
        }else{
            if (User.validateCpf(body.cpf())){
                newUser.setCpf(body.cpf());
            }else{
                responseOk = false;
                throw new CpfInvalidoException("CPF inválido");
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String data = body.dataNascimento();
            //A data no banco dica invertida, ou seja 12/05/199 = 1999-05-12
            if (User.validateDate(data)){
                LocalDate dataFormatada = LocalDate.parse(data, formatter);
                newUser.setDataNascimento(dataFormatada);
            }else{
                responseOk = false;
                throw new DataInvalidaException("A data não é válida");
            }

            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setName(body.name());
            newUser.setTelefone(body.telefone());

            String[] enderecoFinal = User.validateCEP(body.cep());
            if (enderecoFinal[0] == null || enderecoFinal[0].isEmpty()){
                responseOk = false;
                throw new CepInvalidoException("CEP inválido");
            }
            newUser.setCep(body.cep());
            newUser.setCidade(enderecoFinal[0]);
            newUser.setEstado(enderecoFinal[1]);
            newUser.setEndereco(enderecoFinal[2]);
            newUser.setNumero(body.numero());
            newUser.setComplemento(body.complemento());
        }

        if (responseOk){
            this.repository.save(newUser);
            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new ResponseDTO(newUser.getName(), token));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Algo deu errado!");
    }
}
