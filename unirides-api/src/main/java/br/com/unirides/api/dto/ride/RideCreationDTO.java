package br.com.unirides.api.dto.ride;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class RideCreationDTO {
    String origin;
    String destination;
    String originAddress;
    String destinationAddress;
    LocalDate date;
    String time;
    int desiredPassengersNumber;
    String price;
    String distance;
    String duration;
}
