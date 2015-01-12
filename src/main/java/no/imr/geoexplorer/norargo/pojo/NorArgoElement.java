package no.imr.geoexplorer.norargo.pojo;

import java.util.Arrays;
import java.util.List;

import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties({ "id", "measurement", "platform"})
public class NorArgoElement implements NorArgoJson {
    private String id;
    private Measurement measurement;
    private Platform platform;
    
    private List<NorArgoJson> children;
    private String text;
    private boolean leaf = false;    
    
    public Measurement getMeasurement() {
        return measurement;
    }
    public void setMeasurement(Measurement measurement) {
        this.measurement = measurement;
    }
    public Platform getPlatform() {
        return platform;
    }
    public void setPlatform(Platform platform) {
        this.platform = platform;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public boolean isLeaf() {
        return leaf;
    }
    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }
    public List<NorArgoJson> getChildren() {
        return this.children = Arrays.asList(measurement, platform);
    }
    public void setChildren(List<NorArgoJson> children) {
        this.children = children;
    }
    
    public String getLayer() {
        return "";
    }
    public void setLayer(String layer) {
        ;
    }    
}
