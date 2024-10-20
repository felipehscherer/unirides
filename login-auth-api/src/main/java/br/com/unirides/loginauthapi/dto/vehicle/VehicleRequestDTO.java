package br.com.unirides.loginauthapi.dto.vehicle;

import br.com.unirides.loginauthapi.domain.driver.Driver;

import java.util.UUID;

public record VehicleRequestDTO(String email, String color, int capacity, String model, String brand, String plate, Driver driver){
}
