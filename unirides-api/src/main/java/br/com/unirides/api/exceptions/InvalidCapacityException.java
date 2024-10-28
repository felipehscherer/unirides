package br.com.unirides.api.exceptions;

public class InvalidCapacityException extends RuntimeException{
    public InvalidCapacityException(String message) {
        super(message);
    }
}
