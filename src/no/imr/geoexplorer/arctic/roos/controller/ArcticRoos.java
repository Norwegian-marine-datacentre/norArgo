package no.imr.geoexplorer.arctic.roos.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
