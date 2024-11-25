package br.com.unirides.api.domain.ride;

import br.com.unirides.api.domain.driver.Driver;
import br.com.unirides.api.domain.driver.Vehicle;
import br.com.unirides.api.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
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

//    @ManyToOne
//    @JoinColumn(name = "driver_id", nullable = false)
//    private Driver driver;
//
//    @ManyToOne
//    @JoinColumn(name = "vehicle_id", nullable = false)
//    private Vehicle vehicle;

    @ManyToMany
    @JoinTable(
            // essa belezinha aqui vai garantir a relação caronaxpassageiro
            name = "ride_passengers",
            joinColumns = @JoinColumn(name = "ride_id"),
            inverseJoinColumns = @JoinColumn(name = "passenger_id")
    )
    private Set<User> passengers = new HashSet<>();

    private UUID driverId;
    private UUID vehicleId;
    private String cnh;
    private String origin;
    private String destination;
    private String originAddress;
    private String destinationAddress;
    private String originCity;
    private String destinationCity;
    private LocalDate date;
    private String time;
    private int desiredPassengersNumber;
    private int passengersLimit;
    private String price;
    private String distance;
    private String duration;
    private int freeSeatsNumber;

    @Enumerated(EnumType.STRING)
    private RideStatus status;


}
