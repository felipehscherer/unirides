package br.com.unirides.api.domain.driver;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@Entity
@Table(name = "drivers", uniqueConstraints = {
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

        LocalDate dataMudanca = LocalDate.of(2020, 1, 1);

        int anosPermitidos = dataEmissao.isBefore(dataMudanca) ? 5 : 10;
        LocalDate validadeMinima = dataEmissao.plusYears(anosPermitidos - 1);
        LocalDate validadeMaxima = dataEmissao.plusYears(anosPermitidos);

        if (dataValidade.isBefore(dataEmissao)) {
            System.out.println("Erro: A data de validade não pode ser anterior à data de emissão.");
            return false;
        }

        if (dataValidade.isEqual(validadeMaxima) ||
                (dataValidade.isAfter(validadeMinima) && !dataValidade.isAfter(validadeMaxima))) {
            return true;
        } else {
            System.out.println("Erro: A CNH não é válida. A data de validade deve estar entre " +
                    validadeMinima + " e " + validadeMaxima + ".");
            return false;
        }
    }


    public static boolean validarFormatoCNH(String numeroCNH) {
        String regex = "^[0-9]{11}$";

        return numeroCNH != null && numeroCNH.matches(regex);
    }

    public static boolean validarCategoria(String categoria) {
        try {
            DriverLicenseCategory.valueOf(categoria.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }


}
