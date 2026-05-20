package br.com.lancarme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class LancarmeApplication {

    public static void main(String[] args) {
        SpringApplication.run(LancarmeApplication.class, args);
    }
}
