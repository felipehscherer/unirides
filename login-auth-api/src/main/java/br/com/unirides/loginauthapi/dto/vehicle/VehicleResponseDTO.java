package br.com.unirides.loginauthapi.dto.vehicle;

import br.com.unirides.loginauthapi.domain.driver.Vehicle;

public record VehicleResponseDTO(Long id, String email, String color, int capacity, String model, String brand, String plate, long id_driver) {
    public VehicleResponseDTO(Vehicle vehicle) {
        this(vehicle.getId(), vehicle.getUsuarioEmail(), vehicle.getColor(), vehicle.getCapacity(), vehicle.getModel(), vehicle.getBrand(), vehicle.getPlate(), vehicle.getId_driver());
    }

}