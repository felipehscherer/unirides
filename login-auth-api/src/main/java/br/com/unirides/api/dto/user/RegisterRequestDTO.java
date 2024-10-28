package br.com.unirides.api.dto.user;

public record RegisterRequestDTO (String name, String email, String cpf, String password, String telefone, String dataNascimento, String cep, String cidade, String estado, String endereco, int numero, String complemento) {
}
