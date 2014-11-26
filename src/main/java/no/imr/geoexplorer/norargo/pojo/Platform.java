package no.imr.geoexplorer.norargo.pojo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

/**
 * Linjer
 * @author endrem
 *
 */
@JsonIgnoreProperties({ "lastEdited", "wmoPlatformCode"})
@Entity
@Table(name="platform", schema="floats")
public class Platform implements NorArgoJsonInterface {
    @Column(name="id")
    @Id
    private String id;
    @Column(name="last_edited")
    private Date lastEdited;
    @Column(name="wmo_platform_code")
    private String wmoPlatformCode;
    
    @Transient
    private String text;
    @Transient
    private boolean leaf = true;
    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public Date getLastEdited() {
        return lastEdited;
    }
    public void setLastEdited(Date lastEdited) {
        this.lastEdited = lastEdited;
    }
    public String getWmoPlatformCode() {
        return wmoPlatformCode;
    }
    public void setWmoPlatformCode(String wmoPlatformCode) {
        this.wmoPlatformCode = wmoPlatformCode;
    }

    public String getText() {
        return "Linjer";
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
    

}