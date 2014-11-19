package no.imr.geoexplorer.norargo.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import no.imr.geoexplorer.dao.NorArgoDao;
import no.imr.geoexplorer.norargo.pojo.Measurement;
import no.imr.geoexplorer.norargo.pojo.NorArgoElement;
import no.imr.geoexplorer.norargo.pojo.NorArgoElementInterface;
import no.imr.geoexplorer.norargo.pojo.Platform;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class NorArgo {
    
    List<Measurement> m = null;
    Map<String, NorArgoElementInterface> e = null;
    
    @Autowired
    private NorArgoDao dao;
    
    @RequestMapping("/norArgo.html")
    public ModelAndView arcticRoos(HttpServletResponse resp) throws IOException {
        return new ModelAndView("norArgo");
    }
    
    @RequestMapping("/getNorArgoChildNodes.html")
    public @ResponseBody Collection<NorArgoElementInterface> getNorArgoChildNodesAsJson(HttpServletResponse resp) throws IOException {
        if ( m == null) {
            List<Measurement> m = dao.findAllMeasurement();
        
            e = new HashMap<String, NorArgoElementInterface>(m.size());
            for ( Measurement mes : m ) {
                NorArgoElement el = new NorArgoElement();
                el.setMeasurement( mes );
                el.setPlatform( mes.getPlatform() );
                String wmo = mes.getPlatform().getWmoPlatformCode();
                el.setText( wmo );
                e.put( wmo, el );
            }
        }
        return e.values();
    } 
    
    
}
