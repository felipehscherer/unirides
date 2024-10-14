package br.com.unirides.loginauthapi.domain.driver;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@Entity
@Table(name = "drivers")
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

    public static boolean validarDataCNH(String dataEmissaoStr, String dataValidadeStr, String dataNascimentoStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate dataEmissao;
        LocalDate dataValidade;
        LocalDate dataNascimento;

        try {
            dataEmissao = LocalDate.parse(dataEmissaoStr, formatter);
            dataValidade = LocalDate.parse(dataValidadeStr, formatter);
            dataNascimento = LocalDate.parse(dataNascimentoStr, formatter);
        } catch (DateTimeParseException e) {
            System.out.println("Erro: As datas devem estar no formato YYYY-MM-DD.");
            return false;
        }

        int idade = Period.between(dataNascimento, LocalDate.now()).getYears();

        if (dataEmissao.isAfter(LocalDate.now())) {
            System.out.println("Erro: A data de emissão não pode ser uma data futura.");
            return false;
        }

        LocalDate validadePadrao;
        LocalDate dataMudanca = LocalDate.of(2020, 1, 1);

        if (dataEmissao.isBefore(dataMudanca)) {
            if (idade < 50) {
                validadePadrao = dataEmissao.plusYears(5);
            } else if (idade < 70) {
                validadePadrao = dataEmissao.plusYears(5);
            } else {
                validadePadrao = dataEmissao.plusYears(3);
            }
        } else {
            if (idade < 50) {
                validadePadrao = dataEmissao.plusYears(10);
            } else if (idade < 70) {
                validadePadrao = dataEmissao.plusYears(5);
            } else {
                validadePadrao = dataEmissao.plusYears(3);
            }
        }

        LocalDate dataAtual = LocalDate.now();

        if (dataValidade.isBefore(dataEmissao)) {
            System.out.println("Erro: A data de validade não pode ser anterior à data de emissão.");
            return false;
        }

        if (dataValidade.isAfter(dataAtual) && !dataValidade.isBefore(validadePadrao)) {
            return true;
        } else {
            System.out.println("Erro: A CNH não é válida. A data de validade deve ser após a data atual e respeitar a validade padrão.");
            return false;
        }
    }

    public static boolean validarFormatoCNH(String numeroCNH) {
        return numeroCNH != null && numeroCNH.matches("\\d{11}");
    }


}
