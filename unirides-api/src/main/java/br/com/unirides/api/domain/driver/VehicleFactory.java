package br.com.unirides.api.domain.driver;

import br.com.unirides.api.exceptions.CapacityInvalidException;
import br.com.unirides.api.exceptions.PlateInvalidException;

public class VehicleFactory {

    public static Vehicle createVehicle(Driver driver, String color, int capacity, String model, String brand, String plate) {
        if (driver == null) {
            throw new IllegalArgumentException("Motorista não pode ser nulo.");
        }

        if (!Vehicle.validateCapacity(capacity)) {
            throw new CapacityInvalidException("Capacidade inválida. Deve estar entre 2 e 7 lugares.");
        }

        if (!Vehicle.validatePlate(plate.toUpperCase())) {
            throw new PlateInvalidException("Placa inválida. Formato não compatível.");
        }

        return new Vehicle(
                null,
                color,
                capacity,
                model,
                brand,
                plate.toUpperCase(),
                driver,
                true
        );
    }
}
