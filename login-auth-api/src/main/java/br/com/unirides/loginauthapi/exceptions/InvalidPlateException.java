package br.com.unirides.loginauthapi.exceptions;

public class InvalidPlateException extends RuntimeException{
    public InvalidPlateException(String message) {
        super(message);
    }
}
