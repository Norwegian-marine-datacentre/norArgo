package no.imr.geoexplorer.dao;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Terry Hannant <a5119>
 */
public interface ArcticRoosDAO {

    
    public Map getMeasurementProfile(String ID, String date);
    
    public List getFloatLayers();

}
