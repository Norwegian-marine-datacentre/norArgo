package no.imr.geoexplorer.norargo.pojo;


/**
 *
 * @author Terry Hannant <a5119>
 */
public class ArgoPlatform {
    
    
    String program;
    String country;
    String model;
    String startDate;
    String link;
    String WMOCode;

    public String getWMOCode() {
        return WMOCode;
    }

    public void setWMOCode(String WMOCode) {
        this.WMOCode = WMOCode;
    }
    int profileCount;

    public int getProfileCount() {
        return profileCount;
    }

    public void setProfileCount(int profileCount) {
        this.profileCount = profileCount;
    }
    
    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

   

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    
    
    

}
