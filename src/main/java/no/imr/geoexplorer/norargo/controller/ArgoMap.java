package no.imr.geoexplorer.norargo.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import no.imr.geoexplorer.dao.ArgoDao;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.io.IOUtils;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author Terry Hannant <a5119>
 */
@Controller
public class ArgoMap {
    
    private static final org.slf4j.Logger LOG = LoggerFactory.getLogger(ArgoMap.class);
    
    @Autowired
    private ArgoDao argoDao;
    
    @Autowired
    private Configuration configuration ;
 
    /**
     * Initial map load
     */
    @RequestMapping("/map")
    public ModelAndView map(HttpServletResponse resp)  {
        ModelAndView modelView = new ModelAndView("norArgo");
	modelView.addObject("geoserverURL",configuration.getString("geoserver.url"));
        modelView.addObject("headLayer",configuration.getString("layer.currentActivePostion"));
        modelView.addObject("tailLayer",configuration.getString("layer.currentActivePath"));
        modelView.addObject("positionLayer",configuration.getString("layer.allPositions"));
        modelView.addObject("pathLayer",configuration.getString("layer.allPaths"));
        modelView.addObject("dynamicRangePathLayer",configuration.getString("layer.dynamicRangePath"));
        modelView.addObject("dynamicRangePointLayer",configuration.getString("layer.dynamicRangePoint"));
	
        
        try {
            modelView.addObject("floatList",new ObjectMapper().writeValueAsString(argoDao.getFloats()));
             modelView.addObject("floatsByCountry",new ObjectMapper().writeValueAsString(argoDao.getFloatsByCountry()));

        } catch (JsonProcessingException ex) {
            Logger.getLogger(ArgoMap.class.getName()).log(Level.SEVERE, null, ex);
        }
        return  modelView;
    }

    /**
     * Initial map load
     */
    @RequestMapping("/mapDebug")
    public ModelAndView mapWithDebug(HttpServletResponse resp)  {
        ModelAndView result = map(resp);
        result.addObject("debug",true);
        return  result;
    }
    
    @RequestMapping(value="/norArgo/platformMeaurement/metaData", method = RequestMethod.GET)
    public @ResponseBody Object getPlatformMeaurement(@RequestParam("id") String platformID
            ) {
        return argoDao.getPlatformInfo(platformID);
    }
    
       
    @RequestMapping(value="/norArgo/platform/metaData", method = RequestMethod.GET)
    public @ResponseBody Object getPlatformAndMeaurementMetadata(@RequestParam("id") String platformID
            ) {
         
            HashMap result = new HashMap();
            result.put("platform",argoDao.getPlatformInfo(platformID));
            result.put("measurements",argoDao.getMeasurementInfo(platformID));

                    
        return result;
    }

  /** @RequestMapping(value="/norArgo/platformMeaurement", method = RequestMethod.GET)
    public @ResponseBody Map getPlatformMeaurementValue(@RequestParam("id") String platformID,
                @RequestParam("date") String date,
                @RequestParam("latitude") String latitude,
                @RequestParam("longitude") String longitude
                ) {
        return argoDao.getPlatformProfile(platformID,date,latitude,longitude);
    }**/

    @RequestMapping(value="/norArgo/measurement", method = RequestMethod.GET)
    public @ResponseBody Map getMeaurementValue(@RequestParam("id") String id
                ) {
        return argoDao.getPlatformProfile(id);
    }
    
    
    @RequestMapping(value = "/Proxy", method = RequestMethod.GET)
    public void simpleProxy(@RequestParam(value = "url") String sourceURL,
            HttpServletRequest request,
            HttpServletResponse response) {
        HttpURLConnection proxyRequest = createProxyRequest(sourceURL);

        if (proxyRequest != null) {
            try {
               InputStream input = proxyRequest.getInputStream();
               for (String header:proxyRequest.getHeaderFields().keySet()) {
                   if (!(header!= null && header.equals("Transfer-Encoding"))) {
                       response.setHeader(header,proxyRequest.getHeaderField(header));
                   }
               }
                IOUtils.copy(input, response.getOutputStream());
                input.close();
            } catch (IOException ex) {
                
                LOG.error("Error proxying " + sourceURL,ex);
                
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private HttpURLConnection createProxyRequest(String requestURL) {
        HttpURLConnection result = null;
        try {
            URL url = new URL(requestURL);
            result = (HttpURLConnection) url.openConnection();
        } catch (MalformedURLException ex) {
            LOG.error("Incorrect url syntax", ex);
        } catch (IOException ex) {
            LOG.error("Unable to connect", ex);
        }
        return result;
    }
    
}
