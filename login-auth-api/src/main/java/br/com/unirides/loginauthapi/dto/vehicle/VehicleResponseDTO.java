package br.com.unirides.loginauthapi.dto.vehicle;


import br.com.unirides.loginauthapi.domain.driver.Vehicle;

public record VehicleResponseDTO(Long id, String email, String model, String brand, String plate) {
    public VehicleResponseDTO(Vehicle vehicle) {
        this(vehicle.getId(), vehicle.getUsuarioEmail(), vehicle.getModel(), vehicle.getBrand(), vehicle.getPlate());
    }

}