package br.com.unirides.api.utils;

import br.com.unirides.api.repository.UserRepository;
import java.util.regex.Pattern;

public class UserProfileValidationUtils {

    // Valida se o nome está dentro das regras especificadas
    public static boolean validarNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            System.out.println("Erro: Nome não pode estar vazio.");
            return false;
        }
        if (nome.length() < 3 || nome.length() > 50) {
            System.out.println("Erro: Nome deve ter entre 3 e 50 caracteres.");
            return false;
        }
        if (!Pattern.compile("^[A-Za-z\\s]+$").matcher(nome).matches()) {
            System.out.println("Erro: Nome deve conter apenas letras.");
            return false;
        }
        return true;
    }

    // Valida se o novo e-mail está em uso
    public static boolean validarEmailEmUso(UserRepository repository, String newEmail) {
        return repository.findByEmail(newEmail).isPresent();
    }

    // Valida a nova senha
    public static boolean validarSenha(String newPassword) {
        if (newPassword.length() < 8) {
            System.out.println("Erro: Nova senha deve ter no mínimo 8 caracteres.");
            return false;
        }
        if (!Pattern.compile("[A-Z]").matcher(newPassword).find()) {
            System.out.println("Erro: Nova senha deve conter pelo menos uma letra maiúscula.");
            return false;
        }
        if (!Pattern.compile("[a-z]").matcher(newPassword).find()) {
            System.out.println("Erro: Nova senha deve conter pelo menos uma letra minúscula.");
            return false;
        }
        if (!Pattern.compile("[0-9]").matcher(newPassword).find()) {
            System.out.println("Erro: Nova senha deve conter pelo menos um número.");
            return false;
        }
        return true;
    }

    // Valida o número fornecido
    public static boolean validarNumero(String numeroStr) {
        try {
            Integer.parseInt(numeroStr);
            return true;
        } catch (NumberFormatException e) {
            System.out.println("Erro: Número inválido.");
            return false;
        }
    }
}
