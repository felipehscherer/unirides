package br.com.unirides.api.dto.driver;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class DriverRequestDTO {
    private String email;
    private String numeroCnh;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private String dataEmissao;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private String dataValidade;
    private String categoria;
}
