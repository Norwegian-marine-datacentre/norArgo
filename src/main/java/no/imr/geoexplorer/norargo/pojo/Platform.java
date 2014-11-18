package no.imr.geoexplorer.norargo.pojo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="platform", schema="float")
public class Platform {
    @Column(name="id")
    @Id
    private String id;
    @Column(name="lastEdited")
    private Date lastEdited;
    @Column(name="wmoPlatformCode")
    private String wmoPlatformCode;
    
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

    

}
