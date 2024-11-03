package br.com.unirides.loginauthapi.exceptions;

public class CaronaNotFoundException extends RuntimeException{
    public CaronaNotFoundException(String message){
        super(message);
    }
}
