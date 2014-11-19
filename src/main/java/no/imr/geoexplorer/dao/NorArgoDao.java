package no.imr.geoexplorer.dao;

import java.util.List;

import no.imr.geoexplorer.norargo.pojo.LastPositions;
import no.imr.geoexplorer.norargo.pojo.Measurement;
import no.imr.geoexplorer.norargo.pojo.Platform;

public interface NorArgoDao {
    public List<Measurement> findAllMeasurement();
    public List<Platform> findAllPlatform();
    public List<LastPositions> findSisteKjentePosisjon();
}
