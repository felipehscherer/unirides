package br.com.unirides.api.config;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.jdbc.DataSourceBuilder;
import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    @Bean
    public DataSource dataSource() {
        Dotenv dotenv = Dotenv.configure().load();

        return DataSourceBuilder.create()
                .url("jdbc:postgresql://localhost:5432/unirides")
                .username("postgres")
                .password(dotenv.get("SENHA_DB")) // Usa a senha do .env
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
