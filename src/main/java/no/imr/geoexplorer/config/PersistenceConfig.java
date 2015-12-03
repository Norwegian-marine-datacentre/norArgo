package no.imr.geoexplorer.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import java.beans.PropertyVetoException;
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

import no.imr.geoexplorer.dao.ArcticRoosDAO;
import no.imr.geoexplorer.dao.ArcticRoosDAOImpl;


/**
 * This class contains all configuration for the database pools and transaction
 * managers.
 *
 * @author kjetilf
 */
@Configuration
@EnableTransactionManagement
public class PersistenceConfig {

    @Autowired
    private org.apache.commons.configuration.Configuration configuration;

    @Autowired
    private org.apache.commons.configuration.Configuration arcticRoosConfiguration;

    
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

    /**
     * Datasource pool for arcticRoos.
     *
     * @return Pooled data source.
     */
     @Bean(name = "arcticRoosDataSource")
     public ComboPooledDataSource arcticRoosDatasource() throws PropertyVetoException {
         ComboPooledDataSource datasource = new ComboPooledDataSource();
         datasource.setAcquireIncrement(arcticRoosConfiguration.getInt("jdbc.acquireIncrement"));
         datasource.setIdleConnectionTestPeriod(arcticRoosConfiguration.getInt("jdbc.idleConnectionTestPeriod"));
         datasource.setInitialPoolSize(arcticRoosConfiguration.getInt("jdbc.initialPoolSize"));
         datasource.setMinPoolSize(arcticRoosConfiguration.getInt("jdbc.minPoolSize"));
         datasource.setMaxPoolSize(arcticRoosConfiguration.getInt("jdbc.maxPoolSize"));
         datasource.setDriverClass(arcticRoosConfiguration.getString("jdbc.driver"));
         datasource.setUser(arcticRoosConfiguration.getString("jdbc.user"));
         datasource.setPassword(arcticRoosConfiguration.getString("jdbc.password"));
         datasource.setJdbcUrl(arcticRoosConfiguration.getString("jdbc.url"));
         return datasource;
     }

     

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory()
            throws PropertyVetoException, ConfigurationException {
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setDatabase(Database.POSTGRESQL);
        vendorAdapter.setGenerateDdl(false);
        vendorAdapter.setShowSql(true);
        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("no.imr.geoexplorer.norargo.pojo");
        factory.setDataSource(datasource());
        return factory;
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        JpaTransactionManager txManager = new JpaTransactionManager();
        return txManager;
    }
    
    @Bean
    public ArcticRoosDAO arcticRoosDAO() {
        return new ArcticRoosDAOImpl();
    }
            
}
