package br.com.unirides.loginauthapi.domain.driver;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
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

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @JsonProperty("driver_id")
    public UUID getDriverId() {
        return driver != null ? driver.getId() : null;
    }

    public static boolean validatePlate(String strPlate) {
        final String REGEX_MERCOSUL = "^[A-Z]{3}[0-9][A-Z][0-9]{2}$";
        final String REGEX_PRE_MERCOSUL = "^[A-Z]{3}-[0-9]{4}$";
        final String REGEX_ANTIGO = "^[A-Z]{2}-[0-9]{1,4}$";
        final String REGEX_COLECIONADOR = "^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$";

        return strPlate.matches(REGEX_MERCOSUL) || strPlate.matches(REGEX_PRE_MERCOSUL) || strPlate.matches(REGEX_ANTIGO) || strPlate.matches(REGEX_COLECIONADOR);
    }

    public static boolean validateCapacity(int capacity) {
        return (capacity > 1 || capacity < 8);
    }

}
