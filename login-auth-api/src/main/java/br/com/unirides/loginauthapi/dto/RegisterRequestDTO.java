package br.com.unirides.loginauthapi.dto;

public record RegisterRequestDTO (String name, String email, String cpf, String password, String telefone, String dataNascimento, String cep, String cidade, String estado, String endereco) {
}
