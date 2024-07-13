package com.homerental.dev;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.homerental.dev.config.VaultConfig;

@SpringBootApplication
@EnableConfigurationProperties(VaultConfig.class)
public class DevApplication implements CommandLineRunner{

	private Logger logger=LoggerFactory.getLogger(DevApplication.class);

	private VaultConfig vaultConfig;

	public DevApplication(VaultConfig vaultConfig){
		this.vaultConfig=vaultConfig;
	}

	public static void main(String[] args) {
			SpringApplication.run(DevApplication.class, args);
	}

	
	@Override
	public void run(String... args) throws Exception {
		logger.info("------------properties---------");
		logger.info("Stripe Key : "+vaultConfig.getStripeApiKey());
		
	}

}
