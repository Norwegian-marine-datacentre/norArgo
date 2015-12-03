package no.imr.geoexplorer.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import no.imr.geoexplorer.arctic.roos.pojo.FloatLayer;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 *
 * @author Terry Hannant <a5119>
 */
public class ArcticRoosDAOImpl implements ArcticRoosDAO {
    
    private static final org.slf4j.Logger LOG = LoggerFactory.getLogger(ArcticRoosDAOImpl.class);
    
    JdbcTemplate jdbcTemplate;
    
    String GET_ALL_VALUES_FOR_MEASUREMENT ="SELECT measured_value,"
            + " depth,"
            + " mt.short_name,"
            + " long_name "
            + "  FROM measurements.measurement m , "
            + "  measurements.measurement_type_on_measurement mtm ,"
            + "  measurements.measurement_type mt,"
            + "  measurements.value v ,"
            + "  measurements.platform p"
            + "  where m.id_platform = p.id"
            + "  and mtm.id_measurement = m.id "
            + "  and mtm.id_measurement_type = mt.id "
            + "  and v.id_measurement_type = mtm.id"
            + "  and p.code = ? "
            + " and time_measured  = to_timestamp(?,'YYYY-MM-DD HH24:MI:SS') "
            + " order by short_name,depth";

   @Autowired
   @Qualifier("arcticRoosDataSource")
   public void setDataSource(DataSource datasource){
          this.jdbcTemplate  = new JdbcTemplate(datasource);
   }
     
    
    public Map getMeasurementProfile(String ID, String date) {
        Map result = new HashMap<String,ArrayList>();
        
        String type="";
        ArrayList values = null;
        for (Map<String, Object> data:jdbcTemplate.queryForList(GET_ALL_VALUES_FOR_MEASUREMENT, ID,date)) {
          if (!type.equals( (String)data.get("short_name"))) {
              if (values != null) {
                  result.put(type,values);
              }
              values = new ArrayList();
              type =  (String)data.get("short_name");
          }
          
            ArrayList value = new ArrayList();
            value.add(data.get("depth"));
            value.add(data.get("measured_value"));
            values.add(value);
            
        }
            if (values != null) {
                 result.put(type,values);
             }
  
        return result;
    }
  
    public List getFloatLayers()
    {
        ArrayList<FloatLayer> result = new ArrayList<FloatLayer>();
        
        //Theese shoudl be in DB
        FloatLayer layer = new FloatLayer();
        layer.setName("XBT or XCTD profiles");
        layer.setStyle("arcticroos_xbt_xctd");
        layer.setType("TE");
        result.add(layer);
        
        layer = new FloatLayer();
        layer.setName("GTS_TESAC");
        layer.setStyle("arcticroos_gtstesac");
        layer.setType("TE");
        result.add(layer);


        layer = new FloatLayer();
        layer.setName("Profiling floats");
        layer.setStyle("arcticroos_profiling_floats");
        layer.setType("PF");
        result.add(layer);

      
      

        layer = new FloatLayer();
        layer.setName("Moorings");
        layer.setStyle("arcticroos_mooring");
        layer.setType("MO");
        result.add(layer);

          
        layer = new FloatLayer();
        layer.setName("Ferrybox");
        layer.setStyle("arcticroos_ferrybox");
        layer.setType("FB");
        result.add(layer);

                
        layer = new FloatLayer();
        layer.setName("Drifting buoys");
        layer.setStyle("arcticroos_driftingbouy");
        layer.setType("DB");
        result.add(layer);


        
        
        layer = new FloatLayer();
        layer.setName("CTD profiles");
        layer.setStyle("arcticroos_ctd");
        layer.setType("CT");
        result.add(layer);

 			
        layer = new FloatLayer();
        layer.setName("GTS Bathy");
        layer.setStyle("arcticroos_gtsbathy");
        layer.setType("BA");
        result.add(layer);
        
       
        return result;
    }
    
    
}
