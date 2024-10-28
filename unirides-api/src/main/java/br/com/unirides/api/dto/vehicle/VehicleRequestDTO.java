package br.com.unirides.api.dto.vehicle;

import br.com.unirides.api.domain.driver.Driver;

public record VehicleRequestDTO(String email, String color, int capacity, String model, String brand, String plate, Driver driver){
}
