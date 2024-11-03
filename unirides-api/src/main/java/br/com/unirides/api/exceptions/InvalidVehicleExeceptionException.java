package br.com.unirides.api.exceptions;

public class InvalidVehicleExeceptionException extends RuntimeException{
    public InvalidVehicleExeceptionException(String message) {
        super(message);
    }
}
