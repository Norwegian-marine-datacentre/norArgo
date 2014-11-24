package no.imr.geoexplorer.norargo.pojo;

import javax.persistence.Transient;

import org.springframework.stereotype.Component;

@Component
public class LastPositions implements NorArgoJsonInterface {

    @Transient
    private boolean leaf = true;
    @Transient
    private String text = "alle floats";
    @Transient
    private String id = "alle floats";    
    
    
    public boolean isLeaf() {
        return leaf;
    }
    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }
    public String getText() {
        return "Alle floats";
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
    
}
