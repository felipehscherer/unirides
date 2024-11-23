package br.com.unirides.api.domain.user;

import br.com.unirides.api.exceptions.CepInvalidoException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;


@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User { //nome, email, cpf, telefone, datanasciemnto, cep, cidade, estado, endereco, senha
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
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

    @Column(columnDefinition = "BYTEA")
    private byte[] profileImage;

}
