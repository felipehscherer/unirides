package br.com.unirides.api.utils;

import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.exceptions.CpfAlreadyExistsException;
import br.com.unirides.api.exceptions.CpfInvalidoException;
import br.com.unirides.api.exceptions.DataInvalidaException;
import br.com.unirides.api.exceptions.EmailAlreadyExistsException;
import br.com.unirides.api.exceptions.CepInvalidoException;
import br.com.unirides.api.repository.UserRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class UserValidationUtils {

    public static void validateCpf(String cpf, UserRepository repository) {
        if (repository.findByCpf(cpf).isPresent()) {
            throw new CpfAlreadyExistsException("Usuário com este CPF já cadastrado!");
        }
        if (!User.validateCpf(cpf)) {
            throw new CpfInvalidoException("CPF inválido");
        }
    }

    public static void validateEmail(String email, UserRepository repository) {
        if (repository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("E-mail já cadastrado!");
        }
    }

    public static void validateDateOfBirth(String dataNascimento) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        if (!User.validateDate(dataNascimento)) {
            throw new DataInvalidaException("A data não é válida");
        }
        LocalDate.parse(dataNascimento, formatter);
    }

    public static void validateCep(String cep) {
        String[] enderecoFinal = User.validateCEP(cep);
        if (enderecoFinal[0] == null || enderecoFinal[0].isEmpty()) {
            throw new CepInvalidoException("CEP inválido");
        }
    }
}

