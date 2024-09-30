package br.com.unirides.loginauthapi.domain.driver;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuarioEmail;
    private String numeroCnh;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    @Enumerated(EnumType.STRING)
    private DriverLicenseCategory categoria;

}
