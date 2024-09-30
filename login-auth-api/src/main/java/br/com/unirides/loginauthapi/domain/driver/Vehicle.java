package br.com.unirides.loginauthapi.domain.driver;

import br.com.unirides.loginauthapi.dto.vehicle.VehicleRequestDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "veiculos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuarioEmail;
    private String model;
    private String brand;
    private String plate;

    // Adicionar relacionamento com Driver
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    public Vehicle(VehicleRequestDTO vehicleRequestDTO) {
        this.usuarioEmail = vehicleRequestDTO.email();
        this.model = vehicleRequestDTO.model();
        this.brand = vehicleRequestDTO.brand();
        this.plate = vehicleRequestDTO.plate();
    }
}
