package br.com.unirides.api.dto.ride;

import br.com.unirides.api.domain.ride.RideStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class RideSearchResponseDTO {
    private UUID rideId;
    private String origin;
    private String destination;
    private String originAddress;
    private String destinationAddress;
    private String originCity;
    private String destinationCity;
    private LocalDate date;
    private String time;
    private String price;
    private String distance;
    private String duration;
    private int freeSeatsNumber;
    private String driverName;
    private String car;
    private int numPassengers;
    private RideStatus status;
    private boolean isDriver;
}
