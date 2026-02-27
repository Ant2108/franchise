package com.coffee.franchise.api.config;


import io.github.cdimascio.dotenv.Dotenv;


public class DotEnvConfig {

 public DotEnvConfig(){
 }

public static void loadEnv() {
     Dotenv dotenv = Dotenv
             .configure()
             .filename(".env")
             .load();
    dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
}
}
