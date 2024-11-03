package br.com.unirides.api.utils;

import br.com.unirides.api.domain.ride.Ride;
import br.com.unirides.api.domain.ride.RideStatus;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.RideRepository;
import br.com.unirides.api.repository.UserRepository;
import br.com.unirides.api.repository.VehicleRepository;

import java.util.UUID;

public class RideValidationUtils {

    public static void validateDriverExists(DriverRepository driverRepository, UUID driverId) {
        if (!driverRepository.existsById(driverId)) {
            throw new IllegalArgumentException("Motorista não encontrado");
        }
    }

    public static void validateVehicleExists(VehicleRepository vehicleRepository, UUID vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new IllegalArgumentException("Veículo não encontrado");
        }
    }

    public static void validateRideStatusOpen(Ride ride) {
        if (ride.getStatus() != RideStatus.ABERTA) {
            throw new IllegalStateException("Não é possível ingressar em uma carona que não está aberta");
        }
    }

    public static void validateAvailableSeats(Ride ride) {
        if (ride.getLugaresDisponiveis() <= ride.getPassengers().size()) {
            throw new IllegalStateException("Não há lugares disponíveis nesta carona");
        }
    }

    public static void validatePassengerExists(UserRepository userRepository, String passengerId) {
        if (!userRepository.existsById(passengerId)) {
            throw new IllegalArgumentException("Passageiro não encontrado");
        }
    }

    public static void validateRideExists(RideRepository rideRepository, UUID rideId) {
        if (!rideRepository.existsById(rideId)) {
            throw new IllegalArgumentException("Carona não encontrada");
        }
    }
}

