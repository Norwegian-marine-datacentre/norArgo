package no.imr.geoexplorer.norargo.pojo;

import java.util.List;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import no.imr.geoexplorer.dao.NorArgoDao;
import no.imr.geoexplorer.norargo.pojo.Measurement;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:springmvc-servlet.xml"})
public class MeasurementJpaTest {
    
    @Autowired
    NorArgoDao impl;
    
    @org.junit.Test
    public void getMeasurementIntegrationTest() {
        List<Measurement> m = impl.findAllMeasurement();
        System.out.println(m);
    }
}
