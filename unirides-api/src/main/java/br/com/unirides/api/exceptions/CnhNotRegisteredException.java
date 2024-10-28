package br.com.unirides.api.exceptions;

public class CnhNotRegisteredException extends RuntimeException{
    public CnhNotRegisteredException(String message) {
        super(message);
    }
}
