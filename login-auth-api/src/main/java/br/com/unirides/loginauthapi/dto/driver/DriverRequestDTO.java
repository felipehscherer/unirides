package br.com.unirides.loginauthapi.dto.driver;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DriverRequestDTO {
    private String email;
    private String numeroCnh;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    private String categoria;

}
