package br.com.unirides.api.dto.vehicle;

import br.com.unirides.api.domain.driver.Vehicle;

import java.util.UUID;

public record VehicleResponseDTO(UUID id, String color, int capacity, String model, String brand, String plate) {
    public VehicleResponseDTO(Vehicle vehicle) {
        this(vehicle.getId(), vehicle.getColor(), vehicle.getCapacity(), vehicle.getModel(), vehicle.getBrand(), vehicle.getPlate());
    }

}