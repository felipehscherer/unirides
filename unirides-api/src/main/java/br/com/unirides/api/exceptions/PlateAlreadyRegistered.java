package br.com.unirides.api.exceptions;

public class PlateAlreadyRegistered extends RuntimeException{
    public PlateAlreadyRegistered(String message) {
        super(message);
    }
}
