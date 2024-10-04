package br.com.unirides.loginauthapi.domain.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User { //nome, email, cpf, telefone, datanasciemnto, cep, cidade, estado, endereco, senha
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String email;
    private String cpf;
    private String password;
    private String telefone;
    private LocalDate dataNascimento;
    private String cep;
    private String cidade;
    private String estado;
    private String endereco;
    private int numero;
    private String complemento;
}
