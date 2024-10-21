package br.com.unirides.loginauthapi.exceptions;

public class VehicleNotFoundException extends RuntimeException{
    public VehicleNotFoundException (String message){
        super(message);
    }
}
