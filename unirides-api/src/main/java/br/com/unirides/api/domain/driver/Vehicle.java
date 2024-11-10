package br.com.unirides.api.domain.driver;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String color;
    private int capacity;
    private String model;
    private String brand;
    private String plate;

    //(fetch=FetchType.LAZY)
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;
    boolean isActive;

    @JsonProperty("driver_id")
    public UUID getDriverId() {
        return driver != null ? driver.getId() : null;
    }

    public static boolean validatePlate(String strPlate) {
        final String REGEX_MERCOSUL = "^[A-Z]{3}[0-9][A-Z][0-9]{2}$";
        final String REGEX_PRE_MERCOSUL = "^[A-Z]{3}-[0-9]{4}$";
        final String REGEX_ANTIGO = "^[A-Z]{2}-[0-9]{1,4}$";

        return strPlate.matches(REGEX_MERCOSUL) || strPlate.matches(REGEX_PRE_MERCOSUL) || strPlate.matches(REGEX_ANTIGO);
    }

    public static boolean validateCapacity(int capacityInt) {
        return (capacityInt > 1 && capacityInt < 8);
    }

}
