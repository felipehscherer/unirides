package br.com.unirides.api.domain.driver;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@Entity
@Table(name = "drivers",  uniqueConstraints = {
        @UniqueConstraint(columnNames = "usuario_email"),
        @UniqueConstraint(columnNames = "numero_cnh")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String usuarioEmail;
    private String numeroCnh;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    @Enumerated(EnumType.STRING)
    private DriverLicenseCategory categoria;

    public static boolean validarDataCNH(String dataEmissaoStr, String dataValidadeStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate dataEmissao;
        LocalDate dataValidade;

        try {
            dataEmissao = LocalDate.parse(dataEmissaoStr, formatter);
            dataValidade = LocalDate.parse(dataValidadeStr, formatter);
        } catch (DateTimeParseException e) {
            System.out.println("Erro: As datas devem estar no formato YYYY-MM-DD.");
            return false;
        }

        if (dataEmissao.isAfter(LocalDate.now())) {
            System.out.println("Erro: A data de emissão não pode ser uma data futura.");
            return false;
        }

        LocalDate validadePadrao;
        LocalDate dataMudanca = LocalDate.of(2020, 1, 1);

        if (dataEmissao.isBefore(dataMudanca)) {
            validadePadrao = dataEmissao.plusYears(5);
        } else {
            validadePadrao = dataEmissao.plusYears(10);
        }

        if (dataValidade.isBefore(dataEmissao)) {
            System.out.println("Erro: A data de validade não pode ser anterior à data de emissão.");
            return false;
        }

        LocalDate dataAtual = LocalDate.now();

        if (dataValidade.isAfter(dataAtual) && (dataValidade.isEqual(validadePadrao) || dataValidade.isBefore(validadePadrao))) {
            return true;
        } else {
            System.out.println("Erro: A CNH não é válida. A data de validade deve estar dentro do período padrão.");
            return false;
        }
    }

    public static boolean validarFormatoCNH(String numeroCNH) {
        String regex = "^[0-9]{11}$";

        return numeroCNH != null && numeroCNH.matches(regex);
    }


}
