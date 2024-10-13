package br.com.unirides.loginauthapi.domain.user;

import br.com.unirides.loginauthapi.exceptions.CepInvalidoException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.regex.Pattern;


@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User { //nome, email, cpf, telefone, datanasciemnto, cep, cidade, estado, endereco, senha
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String email;
    private String cpf;
    private String password;
    private String telefone;
    private LocalDate dataNascimento;
    private String cep;
    private String cidade;
    private String estado;
    private String endereco;
    private int numero;
    private String complemento;

    public static boolean validateCpf(String strCPF){
        int Soma;
        int Resto;
        Soma = 0;
        if (strCPF.chars().allMatch(c -> c == strCPF.charAt(0))) { // Testa se todos os números são iguais
            return false;
        }

        for (int i = 1; i <= 9; i++) {
            Soma = Soma + Integer.parseInt(strCPF.substring(i-1, i)) * (11 - i);
        }
        Resto = (Soma * 10) % 11;

        if (Resto == 10 || Resto == 11) Resto = 0;
        if (Resto != Integer.parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (int i = 1; i <= 10; i++) {
            Soma = Soma + Integer.parseInt(strCPF.substring(i-1, i)) * (12 - i);
        }
        Resto = (Soma * 10) % 11;

        if (Resto == 10 || Resto == 11) Resto = 0;
        return Resto == Integer.parseInt(strCPF.substring(10, 11));
    }

    public static boolean validateDate(String date) {
        // Regex para verificar o formato DD/MM/AAAA
        String dateRegex = "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$";
        if (!Pattern.matches(dateRegex, date)) {
            return false;
        }

        String[] dateParts = date.split("/");
        int day = Integer.parseInt(dateParts[0]);
        int month = Integer.parseInt(dateParts[1]);
        int year = Integer.parseInt(dateParts[2]);

        try {
            // Usando LocalDate para verificar a validade da data
            LocalDate parsedDate = LocalDate.of(year, month, day);
            LocalDate today = LocalDate.now();
            int currentYear = today.getYear();

            // Verifica se a data é válida e se a pessoa tem pelo menos 16 anos
            return parsedDate.getYear() == year &&
                    parsedDate.getYear() <= (currentYear - 16) &&
                    parsedDate.getMonthValue() == month &&
                    parsedDate.getDayOfMonth() == day;
        } catch (DateTimeParseException e) {
            return false;
        }
    }

    public static String[] validateCEP(String cep) {
        String[] enderecoFinal = new String[3];
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://viacep.com.br/ws/" + cep + "/json/"))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Usando Jackson para mapear o JSON para um Map
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> jsonResponse = objectMapper.readValue(response.body(), Map.class);

            if (jsonResponse.containsKey("erro")) {
                throw new CepInvalidoException("CEP não encontrado!");
            } else {
                String cidade = (String) jsonResponse.get("localidade");
                String estado = (String) jsonResponse.get("uf");  // "uf" para o estado
                String endereco = (String) jsonResponse.get("logradouro");

                enderecoFinal[0] = cidade;
                enderecoFinal[1] = estado;
                enderecoFinal[2] = endereco;
            }

        } catch (Exception e) {
            System.out.println("Erro ao buscar o CEP: " + e.getMessage());
        }
        return enderecoFinal;
    }
}
