package br.com.unirides.api.exceptions;

public class CaronaNotFoundException extends RuntimeException{
    public CaronaNotFoundException(String message){
        super(message);
    }
}
