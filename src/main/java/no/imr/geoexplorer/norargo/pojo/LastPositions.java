package no.imr.geoexplorer.norargo.pojo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

public class LastPositions {
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
}
