package no.imr.geoexplorer.norargo.pojo;

import javax.persistence.Transient;

import org.springframework.stereotype.Component;

@Component
public class LastPositions implements NorArgoJson {

    @Transient
    private boolean leaf = true;
    @Transient
    private String text = "Alle floats";
    @Transient
    private String id = "Alle floats";    
    @Transient
    private String layer = "norargo_all_points";    //norargo_last60daysmovement
    
    public boolean isLeaf() {
        return leaf;
    }
    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getLayer() {
        return this.layer;
    }
    public void setLayer(String layer) {
        this.layer = layer;
    }
}
