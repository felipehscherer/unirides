package br.com.unirides.loginauthapi.domain.ride;

import br.com.unirides.loginauthapi.domain.driver.Driver;
import br.com.unirides.loginauthapi.domain.driver.Vehicle;
import br.com.unirides.loginauthapi.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "rides")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToMany
    @JoinTable(
            name = "ride_passengers",
            joinColumns = @JoinColumn(name = "ride_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> passengers = new HashSet<>(); // TODO rever isso aqui tambem

    @ElementCollection
    @CollectionTable(name = "ride_stops", joinColumns = @JoinColumn(name = "ride_id"))
    @Column(name = "parada")
    private List<String> paradas; // TODO rever isso aqui

    private int lugaresDisponiveis;

    private LocalDateTime horarioPartida;
    private LocalDateTime horarioChegada;
}
