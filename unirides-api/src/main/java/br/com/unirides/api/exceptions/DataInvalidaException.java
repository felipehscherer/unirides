package br.com.unirides.api.exceptions;

public class DataInvalidaException extends RuntimeException{
    public DataInvalidaException(String message){
        super(message);
    }
}

