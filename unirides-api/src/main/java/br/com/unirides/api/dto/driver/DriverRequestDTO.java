package br.com.unirides.api.dto.driver;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
public class DriverRequestDTO {
    private String email;
    private String numeroCnh;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    private String categoria;
}
