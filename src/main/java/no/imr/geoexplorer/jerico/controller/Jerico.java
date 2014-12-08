package no.imr.geoexplorer.jerico.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class Jerico {

    @RequestMapping("/jerico.html")
    public ModelAndView arcticRoos(HttpServletResponse resp) throws IOException {
        return new ModelAndView("jerico");
    }
}
