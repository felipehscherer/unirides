package br.com.unirides.api.exceptions;

public class InvalidPlateException extends RuntimeException{
    public InvalidPlateException(String message) {
        super(message);
    }
}
