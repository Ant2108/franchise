package com.coffee.franchise.api;

import com.coffee.franchise.api.config.DotEnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiApplication {

	public static void main(String[] args) {
        DotEnvConfig.loadEnv();
        SpringApplication.run(ApiApplication.class, args);
	}

}
