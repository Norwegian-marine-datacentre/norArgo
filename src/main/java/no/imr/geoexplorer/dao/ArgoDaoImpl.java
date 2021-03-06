package no.imr.geoexplorer.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import no.imr.geoexplorer.norargo.pojo.ArgoPlatform;
import no.imr.geoexplorer.norargo.pojo.Measurement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

/**
 *
 * @author Terry Hannant <a5119>
 */
public class ArgoDaoImpl implements ArgoDao {

    private JdbcTemplate jdbcTemplate;

     public final String GET_PROFILE_MEASUREMENT_TYPES = " SELECT short_name,"
            + "       units, description "
            + "  FROM floats.measurementvaluetype "
            + "  where"
            + "  short_name != 'PRES' and  "
            + "  id in  ( "
            + "  select distinct  id_measurementvaluetype "
            + "  from floats.measurementvalues mv "
            + "  where id_measurement =  ? "
            + "  ) ";
     
        public final String GET_PROFILE_MEASUREMENT_VALUES = " SELECT    depth, "
            + "round(cast(value as numeric),4) as value "
            + " FROM floats.measurementvaluetype mvt,"
            + " floats.measurementvalues mv "
            + "  where  mv.id_measurement = ?"
            + "  and  mvt.short_name  = ?" //Should really use ID instead of name
            + "  and mvt.id = mv.id_measurementvaluetype "
            + "  order by depth ";
     
    
    public final String GET_PLATFORM_INFO = "select program,"
            + "country,"
            + "model,"
            + "start_date,"
            + "url,"
            + "wmo_platform_code,"
            + "profile_count from "
            + "   (SELECT * FROM floats.platform where id = ?  ) info,"
            + "   (select count(*) as profile_count FROM floats.measurement"
            + "   where id_platform = ? ) profile_count ";
    
    
    public final String GET_FLOAT_MEASUREMENT_INFO = " SELECT    id,"
            + " to_char(datetime,'YYYY-MM-DD HH24:MI') as dateString, "
            + " latitude,"
            + " longitude "
            + " FROM   floats.measurement m "
            + "  where id_platform = ? "
            + "  order by datetime ";


    public final String GET_ALL_PLATFORMS = " SELECT "
            + "  coalesce(country,'Null') as country ,"
            + "  to_char(start_date,'YYYY-MM-DD') as startDate,"
            + "  wmo_platform_code,"
            + "  id"
            + "  FROM floats.platform "
            + "  order by wmo_platform_code";

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List getFloats() {
        return jdbcTemplate.queryForList(GET_ALL_PLATFORMS);
    }

    public Map getFloatsByCountry() {
        HashMap<String,ArrayList<Map>> result = new HashMap<String,ArrayList<Map>>();
     
        String currentCountry = null;

        for (Map<String, Object> floatData : jdbcTemplate.queryForList(GET_ALL_PLATFORMS)) {
                       
            currentCountry = (String) floatData.get("country");
            if (!result.containsKey(currentCountry)) {
                result.put(currentCountry, new ArrayList<Map>());
            }
            floatData.remove("country");  //No longer needed
            result.get(currentCountry).add(floatData);
        }

        return result;
    }

    public Object getPlatformInfo(String platformID) {

        return jdbcTemplate.queryForObject(GET_PLATFORM_INFO,
                new RowMapper<ArgoPlatform>() {

                    public ArgoPlatform mapRow(ResultSet rs, int i) throws SQLException {
                        ArgoPlatform result = new ArgoPlatform();
                        result.setProgram(rs.getString("program"));
                        result.setCountry(rs.getString("country"));
                        result.setModel(rs.getString("model"));
                        result.setStartDate(rs.getString("start_date"));
                        result.setLink(rs.getString("url"));
                        result.setWMOCode(rs.getString("wmo_platform_code"));
                        result.setProfileCount(rs.getInt("profile_count"));
                        return result;
                    }
                }, platformID, platformID);
    }

    
    public Object getMeasurementInfo(String platformID) {
        return jdbcTemplate.query(GET_FLOAT_MEASUREMENT_INFO,
                new RowMapper<Measurement>() {

                    public Measurement mapRow(ResultSet rs, int i) throws SQLException {
                        Measurement result = new Measurement();
                        result.setId(rs.getString("id"));
                        result.setDateString(rs.getString("dateString"));
                        result.setLatitude(rs.getDouble("latitude"));
                        result.setLongitude(rs.getDouble("longitude"));
                        return result;
                    }
                }, platformID);
        
    }
    
    
  /*  public Map xgetPlatformProfile(String platformID, String date,String latitude,String longitude ) {
        HashMap result = new HashMap<String, List>();

        List<Map<String, Object>> results = jdbcTemplate.queryForList(GET_FLOAT_MEASUREMENT_TYPES, platformID, date,latitude,longitude);

        for (Map<String, Object> profileType : results) {
            result.put((String) profileType.get("short_name"),
                    jdbcTemplate.query(GET_FLOAT_MEASUREMENT_VALUES, new RowMapper<List>() {

                        public List mapRow(ResultSet rs, int i) throws SQLException {
                            ArrayList data = new ArrayList(2);
                            data.add(rs.getFloat("depth"));
                            data.add(rs.getBigDecimal("value"));
                            return data;
                        }
                    }, platformID, date,latitude,longitude, (String) profileType.get("short_name")));
        }
        return result;

    }*/
    
     public Map getPlatformProfile(String measurementID ) {
        HashMap result = new HashMap<String, List>();

        List<Map<String, Object>> results = jdbcTemplate.queryForList(GET_PROFILE_MEASUREMENT_TYPES, measurementID);

        for (Map<String, Object> profileType : results) {
            result.put((String) profileType.get("short_name"),
                    jdbcTemplate.query(GET_PROFILE_MEASUREMENT_VALUES, new RowMapper<List>() {

                        public List mapRow(ResultSet rs, int i) throws SQLException {
                            ArrayList data = new ArrayList(2);
                            data.add(rs.getFloat("depth"));
                            data.add(rs.getBigDecimal("value"));
                            return data;
                        }
                    }, measurementID,  (String) profileType.get("short_name")));
        }
        return result;

    }

}
