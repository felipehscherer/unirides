package br.com.unirides.api.exceptions;

public class VehicleNotFoundException extends RuntimeException{
    public VehicleNotFoundException (String message){
        super(message);
    }
}
