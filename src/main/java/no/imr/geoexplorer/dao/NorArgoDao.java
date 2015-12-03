package no.imr.geoexplorer.dao;

import java.util.List;
import java.util.Map;

import no.imr.geoexplorer.norargo.pojo.LastPositions;
import no.imr.geoexplorer.norargo.pojo.Measurement;
import no.imr.geoexplorer.norargo.pojo.Platform;

public interface NorArgoDao {

    public List<Measurement> findAllMeasurement();

    public List<Platform> findAllPlatform();

    public List<LastPositions> findSisteKjentePosisjon();

    public List getFloatMeasurementTypes(String platformID, String date);

    public List getFloatMeasurements(String platformID, String date);

    public List getFloatMeasurements(String platformID, String date, String type);

    public Object getPlatformInfo(String platformID);

    public Map getPlatformProfile(String platformID, String date);

}
