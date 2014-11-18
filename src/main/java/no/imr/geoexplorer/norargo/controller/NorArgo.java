package no.imr.geoexplorer.norargo.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import no.imr.geoexplorer.norargo.pojo.NorArgoElement;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class NorArgo {
    
    @RequestMapping("/norArgo.html")
    public ModelAndView arcticRoos(HttpServletResponse resp) throws IOException {
        return new ModelAndView("norArgo");
    }
    
    @RequestMapping("/getNorArgoChildNodes.html")
    public @ResponseBody List<NorArgoElement> getNorArgoChildNodesAsJson(HttpServletResponse resp) throws IOException {
        //return new ModelAndView("norArgo");
        return null;
    } 
    
    
}
