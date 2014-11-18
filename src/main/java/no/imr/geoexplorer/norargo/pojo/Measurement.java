package no.imr.geoexplorer.norargo.pojo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name="measurement", schema="floats")
public class Measurement {
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
    @Transient   
    private Platform id_platform;
    @Transient    
    private Date date;
    @Transient    
    private Object geometry;
    
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





    
}
