package br.com.unirides.api.repositories;

import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.repository.UserRepository;
import com.github.javafaker.Faker;
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

    private Faker faker;

    @BeforeEach
    public void setUp() {
        userRepository.deleteAll();
        faker = new Faker();
    }

    @Test
    public void testFindByEmail_UserExists() {
        User user = new User();
        user.setEmail(faker.internet().emailAddress());
        user.setPassword(faker.internet().password());
        user.setName(faker.name().fullName());
        user.setCpf(faker.idNumber().valid());
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByEmail(user.getEmail());

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    public void testFindByEmail_UserDoesNotExist() {
        Optional<User> foundUser = userRepository.findByEmail(faker.internet().emailAddress());

        assertThat(foundUser).isNotPresent();
    }

    @Test
    public void testFindByCpf_UserExists() {
        User user = new User();
        user.setEmail(faker.internet().emailAddress());
        user.setPassword(faker.internet().password());
        user.setName(faker.name().fullName());
        user.setCpf(faker.idNumber().valid());
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByCpf(user.getCpf());

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getCpf()).isEqualTo(user.getCpf());
    }

    @Test
    public void testFindByCpf_UserDoesNotExist() {
        Optional<User> foundUser = userRepository.findByCpf("nonexistentCpf");

        assertThat(foundUser).isNotPresent();
    }
}
