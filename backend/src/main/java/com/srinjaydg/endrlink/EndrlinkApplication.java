package com.srinjaydg.endrlink;

import com.srinjaydg.endrlink.Models.Role;
import com.srinjaydg.endrlink.Repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EndrlinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(EndrlinkApplication.class, args);
	}
	@Bean
	public CommandLineRunner runner(RoleRepository roleRepository) {
		return args -> {
			if(roleRepository.findByName ("USER").isEmpty ()){
				roleRepository.save (
						Role.builder ()
								.name ("USER")
								.build ()
				);
			}
		};
	}
}
