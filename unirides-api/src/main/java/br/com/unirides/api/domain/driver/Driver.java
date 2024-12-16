package br.com.unirides.api.domain.driver;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Period;
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

    public static boolean validarDataCNH(LocalDate dataEmissao, LocalDate dataValidade, String dataNascimentoStr) {
        // converte a data de nascimento para LocalDate no formato dd-MM-yyyy
        LocalDate dataNascimento;
        try {
            dataNascimento = LocalDate.parse(dataNascimentoStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (DateTimeParseException e) {
            System.out.println("Erro: A data de nascimento fornecida não está no formato yyyy-MM-dd ou é inválida.");
            return false;
        }

        if (dataEmissao.isAfter(LocalDate.now())) {
            System.out.println("Erro: A data de emissão não pode ser uma data futura.");
            return false;
        }

        // verifica a idade do motorista no periodo da emissao
        int idadeNaEmissao = Period.between(dataNascimento, dataEmissao).getYears();
        if (idadeNaEmissao < 18) {
            System.out.println("Erro: O motorista precisa ter pelo menos 18 anos na data de emissão da CNH.");
            return false;
        }

        if (dataValidade.isBefore(dataEmissao)) {
            System.out.println("Erro: A data de validade não pode ser anterior à data de emissão.");
            return false;
        }

        // validade para cnh provisoria
        if (Period.between(dataEmissao, dataValidade).getYears() <= 1 && Period.between(dataEmissao, dataValidade).getMonths() > 10) {
            return true;
        }

        // validade para cnh dependendo da idade do usuario
        int anosValidadeMinimo;
        int anosValidadeMaximo;

        if (idadeNaEmissao <= 50) {
            anosValidadeMinimo = 9;
            anosValidadeMaximo = 10;
        } else if (idadeNaEmissao <= 70) {
            anosValidadeMinimo = 4;
            anosValidadeMaximo = 5;
        } else {
            anosValidadeMinimo = 2;
            anosValidadeMaximo = 3;
        }

        // limites de validades permitidos
        LocalDate validadeMinima = dataEmissao.plusYears(anosValidadeMinimo);
        LocalDate validadeMaxima = dataEmissao.plusYears(anosValidadeMaximo);

        // validacao da data
        if (!dataValidade.isBefore(validadeMinima) && !dataValidade.isAfter(validadeMaxima)) {
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
