package com.homerental.dev.config;

import java.sql.SQLException;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.vault.core.VaultTemplate;
import org.springframework.vault.support.VaultResponse;

import jakarta.annotation.PostConstruct;
import oracle.ucp.jdbc.PoolDataSource;
import oracle.ucp.jdbc.PoolDataSourceFactory;


@Configuration
public class VaultConfigV1 {

    
    private String stripeApiKey;
    private String dbPassword;
    
    @Autowired
    private VaultTemplate vaultTemplate;

    @Autowired
    private Environment environment;

    @PostConstruct
    public void init() {
        try {
            VaultResponse response = vaultTemplate.read("secret/data/credentials");
            if (response != null) {
                Map<String, Object> data = (Map<String, Object>) response.getData().get("data");
                if (data != null) {
                    stripeApiKey = (String) data.get("stripeApiKey");
                    setStripeApiKey(stripeApiKey);
                    System.setProperty("stripe.apiKey", stripeApiKey);

                    dbPassword= (String) data.get("dbPassword");
                    setDbPassword(dbPassword);
                    //System.setProperty("spring.datasource.password", dbPassword);
                    

                } else {
                    throw new RuntimeException("Data is null or missing in the response.");
                }
            } else {
                throw new RuntimeException("Vault response is null.");
            }
        } catch (Exception e) {
            System.err.println("Error fetching data from Vault: " + e.getMessage());
            throw new RuntimeException("Failed to fetch data from Vault", e);
        }
    }

    @Bean
    public DataSource dataSource() throws SQLException{
        PoolDataSource pds = PoolDataSourceFactory.getPoolDataSource();
                    pds.setConnectionFactoryClassName("oracle.jdbc.pool.OracleDataSource");
                    pds.setURL(environment.getProperty("spring.datasource.url"));
                    pds.setUser(environment.getProperty("spring.datasource.username"));
                    pds.setPassword(dbPassword);
                    pds.setConnectionPoolName("connectionPoolName1");
                    pds.setInitialPoolSize(5);
                    pds.setMinPoolSize(5);
                    pds.setMaxPoolSize(20);
                    return pds;
    }

    

    public String getStripeApiKey() {
        return stripeApiKey;
    }

    public void setStripeApiKey(String stripeApiKey) {
        this.stripeApiKey = stripeApiKey;
    }

    public void setDbPassword(String dbPassword) {
        this.dbPassword = dbPassword;
    }
    
    public String getDbPassword() {
        return dbPassword;
    }
}
