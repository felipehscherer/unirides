package br.com.unirides.api.exceptions;

public class AlreadyAPassengerException extends RuntimeException{
    public AlreadyAPassengerException(String message){
        super(message);
    }
}
