package br.com.unirides.loginauthapi.exceptions;

public class CnhAlreadyRegisteredException extends RuntimeException{
    public CnhAlreadyRegisteredException(String message) {
        super(message);
    }
}
