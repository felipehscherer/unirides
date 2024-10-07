package br.com.unirides.loginauthapi.exceptions;

public class emailAlreadyExistsException extends RuntimeException{
    public emailAlreadyExistsException(String message) {
        super(message);
    }
}
