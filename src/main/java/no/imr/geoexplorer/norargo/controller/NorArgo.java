package no.imr.geoexplorer.norargo.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import no.imr.geoexplorer.dao.NorArgoDao;
import no.imr.geoexplorer.norargo.pojo.LastPositions;
import no.imr.geoexplorer.norargo.pojo.Measurement;
import no.imr.geoexplorer.norargo.pojo.NorArgoElement;
import no.imr.geoexplorer.norargo.pojo.NorArgoJson;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class NorArgo {
    
    List<Measurement> m = null;
    Map<String, NorArgoJson> e = null;
    
    @Autowired
    private NorArgoDao dao;
    
    @RequestMapping("/norArgo.html")
    public ModelAndView arcticRoos(HttpServletResponse resp) throws IOException {
        return new ModelAndView("norArgo");
    }
    
    @RequestMapping("/norArgo_openlayers.html")
    public ModelAndView arcticRoos_new(HttpServletResponse resp) throws IOException {
        return new ModelAndView("norArgo_openlayers");
    }
    
    @RequestMapping("/norArgo_newer.html")
    public ModelAndView arcticRoos_newer(HttpServletResponse resp) throws IOException {
        return new ModelAndView("norArgo_newer");
    }    
    
    @RequestMapping("/getNorArgoChildNodes.html")
    public @ResponseBody List<NorArgoJson> getNorArgoChildNodesAsJson(HttpServletResponse resp) throws IOException {
        List<NorArgoJson> valuesList = null;
        if ( m == null) {
            List<Measurement> m = dao.findAllMeasurement();
        
            e = new HashMap<String, NorArgoJson>(m.size());
            
            for ( Measurement mes : m ) {
                NorArgoElement el = new NorArgoElement();
                el.setMeasurement( mes );
                el.setPlatform( mes.getPlatform() );
                String wmo = mes.getPlatform().getWmoPlatformCode();
                el.setText( wmo );
                e.put( wmo, el );
            }
            
            List<String> keyList = new ArrayList<String>(e.keySet());
            Collections.sort(keyList, String.CASE_INSENSITIVE_ORDER);
            LinkedHashMap<String,NorArgoJson> sortedMap = new LinkedHashMap<String,NorArgoJson>(m.size());
            for(String key: keyList){
                sortedMap.put(key, e.get(key));
            }
            
            valuesList = new ArrayList<NorArgoJson>(sortedMap.values());    
            valuesList.add(0, new LastPositions());
            LastPositions linjer60dager = new LastPositions();
            linjer60dager.setText("bevegelser siste 60 dager");
            linjer60dager.setId("bevegelser siste 60 dager");
            linjer60dager.setLayer("norargo_last60daysmovement");
            valuesList.add(1, linjer60dager);
        }
        return valuesList;
    } 
    
//    @RequestMapping("/getNorArgoChildNodes.html")
    public String getNorArgoChildNodesTest () {
        return "norArgoChildNodesDummy";
    }
    
    @RequestMapping("/testJSONLoader.html")
    public String testJSONLoader () {
        return "testJSONLoader";
    }
    
    @RequestMapping("/wmscap.xml")
    public String wmscap () {
        return "wmscap";
    }
}
