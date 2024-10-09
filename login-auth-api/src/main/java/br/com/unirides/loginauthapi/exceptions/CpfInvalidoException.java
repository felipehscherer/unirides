package br.com.unirides.loginauthapi.exceptions;

public class CpfInvalidoException extends RuntimeException{
    public CpfInvalidoException(String message){
        super(message);
    }
}
