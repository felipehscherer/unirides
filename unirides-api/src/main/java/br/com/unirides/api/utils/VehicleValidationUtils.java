package br.com.unirides.api.utils;

import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.exceptions.InvalidCapacityException;
import br.com.unirides.api.exceptions.InvalidPlateException;
import br.com.unirides.api.exceptions.PlateAlreadyRegistered;
import br.com.unirides.api.repository.VehicleRepository;

public class VehicleValidationUtils {

    private final VehicleRepository vehicleRepository;

    public VehicleValidationUtils(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public void validateVehicle(String plate, int capacity) {
        if (!Vehicle.validateCapacity(capacity)) {
            throw new InvalidCapacityException("Capacidade do veículo inválida");
        }
        if (!Vehicle.validatePlate(plate)) {
            throw new InvalidPlateException("Placa do veículo inválida!");
        }
        if (vehicleRepository.findByPlate(plate).isPresent()) {
            throw new PlateAlreadyRegistered("Placa do veículo já registrada");
        }
    }
}
