package br.com.unirides.api.domain.ride;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.ride.RideSearchResponseDTO;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.UserRepository;
import br.com.unirides.api.repository.VehicleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class RideSearchMapper {
    private final ModelMapper modelMapper;

    public RideSearchMapper(DriverRepository driverRepository, UserRepository userRepository, VehicleRepository vehicleRepository) {
        this.modelMapper = new ModelMapper();

        // Configuração customizada do ModelMapper
        this.modelMapper.typeMap(Ride.class, RideSearchResponseDTO.class).setPostConverter(context -> {
            Ride ride = context.getSource();
            RideSearchResponseDTO dto = context.getDestination();

            Optional<Driver> optionalDriver = driverRepository.findByNumeroCnh(ride.getCnh());
            if (optionalDriver.isPresent()) {
                Driver driver = optionalDriver.get();
                Optional<User> optionalUser = userRepository.findByEmail(driver.getUsuarioEmail());
                optionalUser.ifPresent(user -> dto.setDriverName(user.getName()));

                vehicleRepository.findFirstActiveVehicleByDriverId(driver.getId())
                        .ifPresent(vehicle -> dto.setCar(
                                vehicle.getBrand() + " " + vehicle.getModel() + " " + vehicle.getColor()
                        ));
            }

            dto.setFreeSeatsNumber(ride.getFreeSeatsNumber());
            dto.setNumPassengers(ride.getPassengers().size());
            return dto;
        });
    }

    public RideSearchResponseDTO mapToDTO(Ride ride) {
        return modelMapper.map(ride, RideSearchResponseDTO.class);
    }
}