package no.imr.geoexplorer.config;

import javax.sql.DataSource;
import org.apache.commons.dbcp.BasicDataSource;
import java.beans.PropertyVetoException;
import no.imr.geoexplorer.dao.ArgoDao;
import no.imr.geoexplorer.dao.ArgoDaoImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;



/**
 * This class contains all configuration for the database pools and transaction
 * managers.
 *
 * @author kjetilf
 */
@Configuration
public class PersistenceConfig {

    @Autowired
    private org.apache.commons.configuration.Configuration configuration;
   
    @Bean
    public DataSource dataSource() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName(configuration.getString("jdbc.driver"));
        dataSource.setUrl(configuration.getString("jdbc.url"));
        dataSource.setUsername(configuration.getString("jdbc.user"));
        dataSource.setPassword(configuration.getString("jdbc.password"));
        //dataSource.setMaxWait(configuration.getLong("jdbc.maxWait"));
        return dataSource;
    }

    
    

    
    @Bean ArgoDao getArgoDAO() {
        return new ArgoDaoImpl();
    }
    
   
            
}
