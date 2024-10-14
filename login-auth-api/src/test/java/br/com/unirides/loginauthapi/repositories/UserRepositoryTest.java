package br.com.unirides.loginauthapi.repositories;

import br.com.unirides.loginauthapi.domain.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        userRepository.deleteAll();
    }

    @Test
    public void testFindByEmail_UserExists() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setName("Test User");
        user.setCpf("12345678900");
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    public void testFindByEmail_UserDoesNotExist() {
        Optional<User> foundUser = userRepository.findByEmail("nonexistent@example.com");

        assertThat(foundUser).isNotPresent();
    }

    @Test
    public void testFindByCpf_UserExists() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setName("Test User");
        user.setCpf("12345678900");
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByCpf("12345678900");

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getCpf()).isEqualTo("12345678900");
    }

    @Test
    public void testFindByCpf_UserDoesNotExist() {
        Optional<User> foundUser = userRepository.findByCpf("nonexistentCpf");

        assertThat(foundUser).isNotPresent();
    }
}

