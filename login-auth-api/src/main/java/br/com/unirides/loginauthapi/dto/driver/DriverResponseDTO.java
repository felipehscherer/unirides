package br.com.unirides.loginauthapi.dto.driver;

import br.com.unirides.loginauthapi.domain.driver.DriverLicenseCategory;
import br.com.unirides.loginauthapi.domain.driver.Driver;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DriverResponseDTO {
    private String email;
    private Long usuarioId;
    private String numeroCnh;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    private String categoria;

    public DriverResponseDTO(Driver driver) {
        this.email = driver.getUsuarioEmail();
        this.numeroCnh = driver.getNumeroCnh();
        this.dataEmissao = driver.getDataEmissao();
        this.dataValidade = driver.getDataValidade();
        this.categoria = driver.getCategoria().name();
    }

}