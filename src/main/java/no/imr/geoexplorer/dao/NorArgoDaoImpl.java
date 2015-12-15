package no.imr.geoexplorer.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.math.BigInteger;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import no.imr.geoexplorer.norargo.pojo.ArgoPlatform;
import no.imr.geoexplorer.norargo.pojo.DepthMeasurementValue;

import no.imr.geoexplorer.norargo.pojo.LastPositions;
import no.imr.geoexplorer.norargo.pojo.Measurement;
import no.imr.geoexplorer.norargo.pojo.MeasurementSeries;
import no.imr.geoexplorer.norargo.pojo.Platform;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

/**
 * NMDMission dao layer implementation.
 *
 * @author kjetilf
 */
@Component
public class NorArgoDaoImpl implements NorArgoDao {

    public final String GET_ALL_FLOAT_MEASUREMENT_VALUES = " SELECT short_name,"
            + "value "
            + " FROM floats.measurementvaluetype mvt,"
            + " floats.measurementvalues mv,"
            + "  floats.measurement m "
            + "  where id_platform =:platformID "
            + "  and date = to_date(:date,'YYYY-MM-DD') "
            //        + "  and latitude = :latitude"
            //        + "  and longitude = :longitude  "
            + "  and m.id = mv.id_measurement"
            + "  and mvt.id = mv.id_measurementvaluetype "
            + "  order by short_name,mv.last_edited ";

    public final String GET_FLOAT_MEASUREMENT_VALUES = " SELECT    depth, " 
            + "value "
            + " FROM floats.measurementvaluetype mvt,"
            + " floats.measurementvalues mv,"
            + "  floats.measurement m "
            + "  where id_platform =:platformID "
            + "  and date = to_date(:date,'YYYY-MM-DD') "
            + "  and m.id = mv.id_measurement"
            + "  and  mvt.short_name  = :type" //Should really use ID instead of name
            + "  and mvt.id = mv.id_measurementvaluetype "
            + "  order by depth ";

    public final String GET_FLOAT_MEASUREMENT_TYPES = " SELECT short_name,"
            + "       units, description "
            + "  FROM floats.measurementvaluetype "
            + "  where"
            + "  short_name != 'PRES' and  "
            + "  id in  ("
            + "  select  id_measurementvaluetype "
            + "  from floats.measurementvalues mv,"
            + "  floats.measurement m "
            + "  where id_measurement =  m.id and"
            + "  m.id_platform =:platformID "
            + " and date = to_date(:date,'YYYY-MM-DD') "
            + "  ) " ;
     
      public final String GET_PLATFORM_INFO = " SELECT program ,"
              + " country ,"
              + " model,"
              + "  to_char(start_date,'YYYY-MM-DD'),"
              + "  url,"
              + "  wmo_platform_code"
              + "  FROM floats.platform "
              + "  where"
              + "   id = :platformID ";
      
      
      public final String COUNT_PLATFORM_PROFILES = " SELECT count(*)"
              + "  FROM floats.measurement "
              + "  where"
              + "   id_platform = :platformID ";
    
    
        /**
         * Entity manager.
         */
        @PersistenceContext
    private EntityManager entityManager;

    private ApplicationContext context;

    @Autowired
    public NorArgoDaoImpl(ApplicationContext context) {
        System.out.println("sdaf");
    }

    @Override
    public List<Measurement> findAllMeasurement() {
     return (List<Measurement>) entityManager.createQuery("select m from Measurement m")
                .getResultList();
    }

    @Override
    public List<Platform> findAllPlatform() {
        return (List<Platform>) entityManager.createQuery("select p from Platform p")
                .getResultList();

    }

    @Override
    public List<LastPositions> findSisteKjentePosisjon() {
        return (List<LastPositions>) entityManager.createQuery("select c FROM floats.currentmeasurement c")
                .getResultList();
    }

    public List getFloatMeasurements(String platformID, String date) {

        ArrayList resultList = new ArrayList<DepthMeasurementValue>();
        Query query = entityManager.createNativeQuery(GET_ALL_FLOAT_MEASUREMENT_VALUES);
        query.setParameter("platformID", platformID);
        query.setParameter("date", date);

        List<Object[]> results = query.getResultList();

        String type = "";
        MeasurementSeries measureSeries = null;
        DepthMeasurementValue depthValue;

        for (Object[] result : results) {
            if ((!type.equals(result[0])) || (measureSeries == null)) {
                type = (String) result[0];
                if (measureSeries != null) {
                    resultList.add(measureSeries);
                }
                measureSeries = new MeasurementSeries();
                measureSeries.setShortName(type);

            }
            depthValue = new DepthMeasurementValue();
            depthValue.setValue((Double) result[1]);
            depthValue.setDepth(measureSeries.getDepthMeasurementValues().size());

            measureSeries.getDepthMeasurementValues().add(depthValue);

        }
        if (measureSeries != null) {
            resultList.add(measureSeries);
        }

        return resultList;
    }

    public List getFloatMeasurements(String platformID, String date, String type) {

        ArrayList resultList = new ArrayList<DepthMeasurementValue>();
        Query query = entityManager.createNativeQuery(GET_FLOAT_MEASUREMENT_VALUES);
        query.setParameter("platformID", platformID);
        query.setParameter("date", date);
        query.setParameter("type", type);

        List<Object[]> results = query.getResultList();

        DepthMeasurementValue depthValue;
        for (Object[] result : results) {
            depthValue = new DepthMeasurementValue();
            //depthValue.setDepth(((BigInteger) result[0]).doubleValue());
            depthValue.setDepth((Double) result[0]);
            depthValue.setValue((Double) result[1]);
            resultList.add(depthValue);
        }

        return resultList;
    }

    public List getFloatMeasurementTypes(String platformID, String date) {
        Query query = entityManager.createNativeQuery(GET_FLOAT_MEASUREMENT_TYPES);
        query.setParameter("platformID", platformID);
        query.setParameter("date", date);
        return query.getResultList();
    }

    public Object getPlatformInfo(String platformID) {
       Query query = entityManager.createNativeQuery(GET_PLATFORM_INFO);
        query.setParameter("platformID", platformID);
        
         Object[] rawResult = (Object[]) query.getSingleResult();
         
         ArgoPlatform result = new  ArgoPlatform();

         result.setProgram((String) rawResult[0]);
         result.setCountry((String) rawResult[1]);
         result.setModel((String) rawResult[2]);
         result.setStartDate((String) rawResult[3]);
         result.setLink((String) rawResult[4]);
         result.setWMOCode((String) rawResult[5]);
 
         query = entityManager.createNativeQuery(COUNT_PLATFORM_PROFILES);
         query.setParameter("platformID", platformID);
        
        result.setProfileCount(((BigInteger) query.getSingleResult()).intValue());
         
        
        return result;
    }

    public Map getPlatformProfile(String platformID, String date) {
        HashMap result = new HashMap<String,List>();
      
        Query query = entityManager.createNativeQuery(GET_FLOAT_MEASUREMENT_TYPES);
        query.setParameter("platformID", platformID);
        query.setParameter("date", date);
        
        List<Object[]> results = query.getResultList();
        
        for (Object[] type: results) {
            Query queryValues = entityManager.createNativeQuery(GET_FLOAT_MEASUREMENT_VALUES);
            queryValues.setParameter("platformID", platformID);
            queryValues.setParameter("date", date);
            queryValues.setParameter("type", (String) type[0]);

            List<Object[]> valueResults = queryValues.getResultList();

 
            
            result.put((String)type[0],valueResults);
            
            
        }
        
        return result;

    
    
     
    
    }

}
