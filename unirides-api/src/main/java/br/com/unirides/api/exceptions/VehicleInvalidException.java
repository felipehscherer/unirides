package br.com.unirides.api.exceptions;

public class VehicleInvalidException extends RuntimeException{
    public VehicleInvalidException(String message) {
        super(message);
    }
}
