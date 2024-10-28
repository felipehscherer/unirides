package br.com.unirides.api.exceptions;

public class emailAlreadyExistsException extends RuntimeException{
    public emailAlreadyExistsException(String message) {
        super(message);
    }
}
