package br.com.unirides.api.dto.ride;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RideSearchResponseDTO {
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
}
