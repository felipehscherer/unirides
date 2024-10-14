package br.com.unirides.loginauthapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LoginAuthApiApplication {

	public static void main(String[] args) {
		//Dotenv dotenv = Dotenv.load();
		SpringApplication.run(LoginAuthApiApplication.class, args);
	}

}
