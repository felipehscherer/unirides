package br.com.unirides.loginauthapi.exceptions;

public class CepInvalidoException extends RuntimeException{
    public CepInvalidoException(String message){
        super(message);
    }
}
