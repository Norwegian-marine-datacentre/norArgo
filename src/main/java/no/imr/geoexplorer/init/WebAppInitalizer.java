package no.imr.geoexplorer.init;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import no.imr.framework.logging.logback.initalize.InitalizeLogbackHandler;
import no.imr.framework.logging.slf4j.exceptions.LoggerInitalizationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.support.AbstractDispatcherServletInitializer;

/**
 *
 * @author Terry Hannant <a5119>
 */
public class WebAppInitalizer  extends AbstractDispatcherServletInitializer {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebAppInitalizer.class);
    
     
  @Override
    protected WebApplicationContext createServletApplicationContext() {
        //What do we need to scan here?
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        return ctx;
    }
 
    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    @Override
    protected WebApplicationContext createRootApplicationContext() {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.scan("no.imr.geoexplorer.config");
        ctx.scan("no.imr.geoexplorer.norargo.controller");
//        ctx.scan("no.imr.geoexplorer.pojo");
        
        return ctx;
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        super.onStartup(servletContext);
        /* FilterRegistration.Dynamic encodingFilter = servletContext.addFilter("encodingFilter", org.springframework.web.filter.CharacterEncodingFilter.class);
        encodingFilter.setInitParameter("encoding", "UTF-8");
        encodingFilter.setInitParameter("forceEncoding", "true");
        encodingFilter.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), false, "/*");
    */
        
        try {
            InitalizeLogbackHandler.getInstance().initalize(System.getProperty("catalina.base") + "/conf/norArgo_logback_v1.xml", true);
       
       } catch (LoggerInitalizationException ex) {
            LOGGER.error("Logging initializaton failed.", ex);
        }
        LOGGER.info("Entering application.");
           
    }
     
}
     

    
