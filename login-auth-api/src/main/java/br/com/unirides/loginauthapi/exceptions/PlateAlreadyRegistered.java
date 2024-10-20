package br.com.unirides.loginauthapi.exceptions;

public class PlateAlreadyRegistered extends RuntimeException{
    public PlateAlreadyRegistered(String message) {
        super(message);
    }
}
