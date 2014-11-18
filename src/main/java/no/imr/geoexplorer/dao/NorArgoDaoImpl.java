package no.imr.geoexplorer.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import no.imr.geoexplorer.norargo.pojo.Measurement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

/**
 * NMDMission dao layer implementation.
 *
 * @author kjetilf
 */
@Component
public class NorArgoDaoImpl implements NorArgoDao{


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
        /*
        @Override
        public List<Mission> findAllMissions() {
            return (List<Mission>) entityManager.createQuery("select m from Mission m")
                    .getResultList();
        }

        @Override
        public List<Mission> findByCruiseCode(final String cruiseCode) {
            return (List<Mission>) entityManager.createQuery("select mission from Mission mission where mission.cruiseMission.cruiseCode = :cruiseCode ")
                    .setParameter("cruiseCode", cruiseCode)
                    .getResultList();
        }

        @Override
        public List<Mission> findByQuery(final String queryParam) {
            List<Mission> result = null;
            try {
                Query query = entityManager.createQuery("select mission from Mission mission where " + queryParam);
                result = query.getResultList();
            } catch (java.lang.IllegalArgumentException ex) {
                throw new IllegalWhereConditionException("Illegal query.", ex);
            }
            return result;
        }
*/
    }
