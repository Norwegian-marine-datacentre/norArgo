package no.imr.geoexplorer.arctic.roos.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * 
 * @author endrem
 *
 */
@Controller
public class ArcticRoos {

    @RequestMapping("/arctic-roos.html")
    public ModelAndView arcticRoos(HttpServletResponse resp) throws IOException {
    	System.out.println("arctic-roos");
    	return new ModelAndView("arctic-roos");
    }
    
	@RequestMapping("/getChildNodes")
    public @ResponseBody List getChildNodesAsJson(HttpServletRequest request, @RequestParam("node") String node) {
		return null;
	}
}
