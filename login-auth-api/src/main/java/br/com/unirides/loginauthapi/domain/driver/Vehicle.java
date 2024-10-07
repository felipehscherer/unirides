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
    private String color;
    private int Capacity;
    private String model;
    private String brand;
    private String plate;
    private long id_driver;

}
