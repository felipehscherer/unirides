package br.com.unirides.api.exceptions;

public class CnhInvalidDateException extends RuntimeException{
    public CnhInvalidDateException(String message){
        super(message);
    }
}
