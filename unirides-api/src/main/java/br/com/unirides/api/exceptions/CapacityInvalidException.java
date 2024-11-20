package br.com.unirides.api.exceptions;

public class CapacityInvalidException extends RuntimeException{
    public CapacityInvalidException(String message) {
        super(message);
    }
}
