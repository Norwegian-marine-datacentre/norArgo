package no.imr.geoexplorer.norargo.controller;

import java.io.IOException;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import no.imr.geoexplorer.dao.ArgoDao;

import org.apache.commons.configuration.Configuration;
import org.codehaus.jackson.map.ObjectMapper;
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
    
    @Autowired
    private ArgoDao argoDao;
    
    @Autowired
    private Configuration configuration ;
 
    /**
     * Initial map load
     */
    @RequestMapping("/map")
    public ModelAndView map(HttpServletResponse resp) throws IOException {
        ModelAndView modelView = new ModelAndView("norArgo");
        modelView.addObject("headLayer",configuration.getString("layer.currentActivePostion"));
        modelView.addObject("tailLayer",configuration.getString("layer.currentActivePath"));
        modelView.addObject("positionLayer",configuration.getString("layer.allPositions"));
        modelView.addObject("pathLayer",configuration.getString("layer.allPaths"));
        modelView.addObject("floatList",new ObjectMapper().writeValueAsString(argoDao.getFloats()));
        modelView.addObject("floatsByCountry",new ObjectMapper().writeValueAsString(argoDao.getFloatsByCountry()));
        return  modelView;
    }

  
    @RequestMapping(value="/norArgo/platformMeaurement/metaData", method = RequestMethod.GET)
    public @ResponseBody Object getPlatformMeaurement(@RequestParam("id") String platformID
            ) {
        return argoDao.getPlatformInfo(platformID);
    }

    @RequestMapping(value="/norArgo/platformMeaurement", method = RequestMethod.GET)
    public @ResponseBody Map getPlatformMeaurementValue(@RequestParam("id") String platformID,
                @RequestParam("date") String date) {
        return argoDao.getPlatformProfile(platformID,date);
    }

}
