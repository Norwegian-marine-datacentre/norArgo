package no.imr.geoexplorer.norargo.controller;

import java.util.Collection;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:springmvc-servlet.xml"})
public class NorArgoControllerTest {

    @Autowired
    private NorArgo n;
    
    @Test
    public void test() throws Exception {
        Collection l = n.getNorArgoChildNodesAsJson(null);
        System.out.println("sdaf"+l);
    }
}
