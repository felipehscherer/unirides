package br.com.unirides.api.exceptions;

public class CpfInvalidoException extends RuntimeException{
    public CpfInvalidoException(String message){
        super(message);
    }
}
