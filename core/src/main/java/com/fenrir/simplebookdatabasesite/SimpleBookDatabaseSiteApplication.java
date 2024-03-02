package com.fenrir.simplebookdatabasesite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class SimpleBookDatabaseSiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(SimpleBookDatabaseSiteApplication.class, args);
    }

}
