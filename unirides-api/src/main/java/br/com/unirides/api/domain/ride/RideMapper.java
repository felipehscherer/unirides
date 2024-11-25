package br.com.unirides.api.domain.ride;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.dto.ride.RideCreationDTO;
import org.modelmapper.ModelMapper;

public class RideMapper {
    private static final ModelMapper modelMapper = new ModelMapper();

    public static Ride mapToRide(RideCreationDTO dto, Driver driver, Vehicle vehicle) {
        Ride ride = modelMapper.map(dto, Ride.class);
        ride.setDriverId(driver.getId());
        ride.setVehicleId(vehicle.getId());
        ride.setCnh(driver.getNumeroCnh());
        ride.setPassengersLimit(vehicle.getCapacity());
        ride.setStatus(RideStatus.ABERTA);
        ride.setFreeSeatsNumber(
                Math.min(dto.getDesiredPassengersNumber(), vehicle.getCapacity() - 1)
        );
        return ride;
    }
}
