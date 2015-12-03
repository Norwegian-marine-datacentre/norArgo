package no.imr.geoexplorer.norargo.pojo;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Terry Hannant <a5119>
 */
public class MeasurementSeries {
    
    String shortName;
    String id;
    String description;
    List<DepthMeasurementValue> depthMeasurementValues= new ArrayList<DepthMeasurementValue>();

    public List<DepthMeasurementValue> getDepthMeasurementValues() {
        return depthMeasurementValues;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    

}
 