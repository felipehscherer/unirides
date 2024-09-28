package br.com.unirides.loginauthapi.domain.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String cpf;
    private String email;
    private String telefone;
    private String dataNascimento;
    private String cep;
    private String cidade;
    private String estado;
    private String endereco;
    private String password;
}
