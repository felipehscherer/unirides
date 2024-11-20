package br.com.unirides.api.exceptions;

public class PlateInvalidException extends RuntimeException{
    public PlateInvalidException(String message) {
        super(message);
    }
}
