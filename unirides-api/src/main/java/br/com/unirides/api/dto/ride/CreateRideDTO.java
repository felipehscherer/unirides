package br.com.unirides.api.dto.ride;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class CreateRideDTO {
    private UUID driverId;
    private UUID vehicleId;
    private Set<UUID> passengerIds;
    private List<String> paradas;
    private int lugaresDisponiveis;
    private LocalDateTime horarioPartida;
    private LocalDateTime horarioChegada;
}
