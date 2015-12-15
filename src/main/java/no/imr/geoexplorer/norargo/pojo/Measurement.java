package no.imr.geoexplorer.norargo.pojo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import org.apache.commons.configuration.Configuration;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Autowired;
/**
 * Punkter
 * @author endrem
 *
 */
@JsonIgnoreProperties({ "id", "last_edited", "latitude","longitude","original","platform","date","geometry" })
@Entity
@Table(name="measurement", schema="floats")
public class Measurement implements NorArgoJson {
    
    @Id
    @Column(name="id")
    private String id;
    @Column(name="last_edited")
    private Date last_edited;
    @Column(name="latitude")
    private double latitude;
    @Column(name="longitude")
    private double longitude;
    @Transient
    private int original;    
    @ManyToOne
    @JoinColumn(name = "id_platform")
    private Platform platform;
    @Transient    
    private Date date;
    @Transient    
    private Object geometry;
    
    @Transient
    private String text;
    @Transient
    private boolean leaf = true;
    @Transient
    private String idPlatform;
    @Transient
     private String layer;
  //    private String layer = "norargo_points";
   // private String layer = "norargo_points_dev";
    
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

    public Date getLast_edited() {
        return last_edited;
    }

    public void setLast_edited(Date last_edited) {
        this.last_edited = last_edited;
    }



    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getText() {
        return "Punkter";
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

    public String getIdPlatform() {
        return platform.getId();
    }

    public void setIdPlatform(String idPlatform) {
        this.idPlatform = idPlatform;
    }
    
    public String getLayer() {
        return this.layer;
    }
    public void setLayer(String layer) {
        this.layer = layer;
    }
    
}
