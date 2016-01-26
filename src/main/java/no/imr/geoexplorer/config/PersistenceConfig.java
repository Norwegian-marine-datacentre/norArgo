package no.imr.geoexplorer.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import java.beans.PropertyVetoException;
import no.imr.geoexplorer.dao.ArgoDao;
import no.imr.geoexplorer.dao.ArgoDaoImpl;
import org.apache.commons.configuration.ConfigurationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;



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
   
    /**
     * Datasource pool.
     *
     * @return Pooled data source.
     */
     @Bean(name = "dataSource")
     public ComboPooledDataSource datasource() throws PropertyVetoException {
         ComboPooledDataSource datasource = new ComboPooledDataSource();
         datasource.setAcquireIncrement(configuration.getInt("jdbc.acquireIncrement"));
         datasource.setIdleConnectionTestPeriod(configuration.getInt("jdbc.idleConnectionTestPeriod"));
         datasource.setInitialPoolSize(configuration.getInt("jdbc.initialPoolSize"));
         datasource.setMinPoolSize(configuration.getInt("jdbc.minPoolSize"));
         datasource.setMaxPoolSize(configuration.getInt("jdbc.maxPoolSize"));
         datasource.setDriverClass(configuration.getString("jdbc.driver"));
         datasource.setUser(configuration.getString("jdbc.user"));
         datasource.setPassword(configuration.getString("jdbc.password"));
         datasource.setJdbcUrl(configuration.getString("jdbc.url"));
         return datasource;
     }

     

    
    @Bean ArgoDao getArgoDAO() {
        return new ArgoDaoImpl();
    }
    
   
            
}
