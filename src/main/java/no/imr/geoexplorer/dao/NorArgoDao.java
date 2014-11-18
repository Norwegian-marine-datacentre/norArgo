package no.imr.geoexplorer.dao;

import java.util.List;

import no.imr.geoexplorer.norargo.pojo.Measurement;

public interface NorArgoDao {
    public List<Measurement> findAllMeasurement();
}
