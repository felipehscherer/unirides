package br.com.unirides.api.dto.ride;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class RideJoinDTO {
    private UUID passengerId;
}
