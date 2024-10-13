package br.com.unirides.loginauthapi.exceptions;

public class DataInvalidaException extends RuntimeException{
    public DataInvalidaException(String message){
        super(message);
    }
}

