package br.com.unirides.api.domain.ride;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.dto.ride.RideSearchResponseDTO;
import br.com.unirides.api.repository.DriverRepository;
import br.com.unirides.api.repository.UserRepository;
import br.com.unirides.api.repository.VehicleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class RideSearchMapper {
    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

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
            dto.setDriver(false);
            return dto;
        });

        // Ignora o campo isDriver durante o mapeamento automático
        this.modelMapper.typeMap(Ride.class, RideSearchResponseDTO.class).addMappings(mapper -> {
            mapper.skip(RideSearchResponseDTO::setDriver);
        });
    }

    public RideSearchResponseDTO mapToDTO(Ride ride) {
        return modelMapper.map(ride, RideSearchResponseDTO.class);
    }

    public RideSearchResponseDTO mapToDTOWithPassengerId(Ride ride, UUID passengerId) {
        RideSearchResponseDTO dto = modelMapper.map(ride, RideSearchResponseDTO.class);
        Optional<Driver> optionalDriver = driverRepository.findById(ride.getDriverId());
        if (optionalDriver.isPresent()) {
            Driver driver = optionalDriver.get();

            Optional<User> optionalUser = userRepository.findByEmail(driver.getUsuarioEmail());
            if (optionalUser.isPresent()) {
                boolean isDriver = optionalUser.get().getId().equals(passengerId);
                dto.setDriver(isDriver);
            } else {
                dto.setDriver(false);
            }
        } else {
            dto.setDriver(false); // Default caso o motorista não seja encontrado
        }

        return dto;
    }
}