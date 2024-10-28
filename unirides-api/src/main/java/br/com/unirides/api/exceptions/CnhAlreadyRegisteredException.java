package br.com.unirides.api.exceptions;

public class CnhAlreadyRegisteredException extends RuntimeException{
    public CnhAlreadyRegisteredException(String message) {
        super(message);
    }
}
