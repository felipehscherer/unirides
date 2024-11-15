package br.com.unirides.api.dto.ride;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RideSearchDTO {
    String origin;
    String destination;
    String originAddress;
    String destinationAddress;
}
