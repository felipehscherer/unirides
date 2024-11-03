package br.com.unirides.api.dto.ride;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class RideCreationDTO {
    private UUID driverId;
    private UUID vehicleId;
    private String destinoInicial;
    private String destinoFinal;
    private int lugaresDisponiveis;
    private LocalDateTime horarioPartida;
    private LocalDateTime horarioChegada;
}
