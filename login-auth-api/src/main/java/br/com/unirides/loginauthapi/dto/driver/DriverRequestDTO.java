package br.com.unirides.loginauthapi.dto.driver;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
public class DriverRequestDTO {
    private String email;
    private String numeroCnh;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    private String categoria;
}
