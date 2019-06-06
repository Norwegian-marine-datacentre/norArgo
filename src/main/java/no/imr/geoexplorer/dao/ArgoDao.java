package no.imr.geoexplorer.dao;

import java.util.List;
import java.util.Map;

/**
 *
 * @author Terry Hannant <a5119>
 */
public interface ArgoDao {

    public List getFloats();

    public Map getFloatsByCountry();

    public Object getPlatformInfo(String platformID);
    public Object getMeasurementInfo(String platformID);

    public Map getPlatformProfile(String measurementID);

    
}
