package com.coffee.franchise.api;

import com.coffee.franchise.api.config.DotEnvConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import java.util.TimeZone;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class ApiApplication {

    public static void main(String[] args) {
//        DotEnvConfig.loadEnv();
        SpringApplication.run(ApiApplication.class, args);
    }

    @PostConstruct
    public void init() {
        // Đặt timezone mặc định cho ứng dụng là giờ Việt Nam
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    }

}
