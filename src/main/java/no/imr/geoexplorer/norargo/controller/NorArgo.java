package no.imr.geoexplorer.norargo.controller;

import java.awt.Color;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletResponse;

import no.imr.geoexplorer.dao.NorArgoDao;
import no.imr.geoexplorer.norargo.pojo.DepthMeasurementValue;
import no.imr.geoexplorer.norargo.pojo.LastPositions;
import no.imr.geoexplorer.norargo.pojo.Measurement;
import no.imr.geoexplorer.norargo.pojo.NorArgoElement;
import no.imr.geoexplorer.norargo.pojo.NorArgoJson;
import no.imr.geoexplorer.norargo.pojo.Platform;
import org.apache.commons.configuration.Configuration;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.encoders.EncoderUtil;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.data.xy.XYSeries;
import org.jfree.data.xy.XYSeriesCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class NorArgo {
    
    List<Measurement> m = null;
    Map<String, NorArgoJson> e = null;
    
    @Autowired
    private NorArgoDao dao;
    
    @Autowired
    private Configuration configuration ;
    
    
    @RequestMapping("/map")
    public ModelAndView map(HttpServletResponse resp) throws IOException {
        ModelAndView modelView = new ModelAndView("norArgo");
        modelView.addObject("headLayer",configuration.getString("layer.currentActivePostion"));
        modelView.addObject("tailLayer",configuration.getString("layer.currentActivePath"));
        
         
        return  modelView;
    }
    
    @RequestMapping("/getNorArgoChildNodes.html")
    public @ResponseBody List<NorArgoJson> getNorArgoChildNodesAsJson(HttpServletResponse resp) throws IOException {
        List<NorArgoJson> valuesList = null;
        if ( m == null) {
            List<Measurement> m = dao.findAllMeasurement();
        
            e = new HashMap<String, NorArgoJson>(m.size());
            
            for ( Measurement mes : m ) {
                
                mes.setLayer(configuration.getString("layer.allPositions"));
                NorArgoElement el = new NorArgoElement();
                el.setMeasurement( mes );
                
                Platform p = mes.getPlatform();
                p.setLayer(configuration.getString("layer.allPaths"));
                el.setPlatform( mes.getPlatform() );
                
                
                String wmo = mes.getPlatform().getWmoPlatformCode();
                el.setText( wmo );
                e.put( wmo, el );
            }
            
            List<String> keyList = new ArrayList<String>(e.keySet());
            Collections.sort(keyList, String.CASE_INSENSITIVE_ORDER);
            LinkedHashMap<String,NorArgoJson> sortedMap = new LinkedHashMap<String,NorArgoJson>(m.size());
            for(String key: keyList){
                sortedMap.put(key, e.get(key));
            }
            
            valuesList = new ArrayList<NorArgoJson>(sortedMap.values());    
     //       valuesList.add(0, new LastPositions());
            LastPositions linjer60dager = new LastPositions();
            linjer60dager.setText("bevegelser siste 60 dager");
            linjer60dager.setId("bevegelser siste 60 dager");
            //linjer60dager.setLayer("norargo_last60daysmovement");
            linjer60dager.setLayer("norargo_last60daysmovement_dev");
           // valuesList.add(0, linjer60dager);
            
            linjer60dager = new LastPositions();
            linjer60dager.setText("bevegelser siste 60 dager (Faster)");
            linjer60dager.setId("bevegelser siste 60 dager-f");
            //linjer60dager.setLayer("norargo_last60daysmovement");
            linjer60dager.setLayer("norago_last60daysmovement_dev_newQuery");
            //valuesList.add(0, linjer60dager);

            linjer60dager = new LastPositions();
            linjer60dager.setText("bevegelser siste 60 dager (No view)");
            linjer60dager.setId("bevegelser siste 60 dager-n");
            //linjer60dager.setLayer("norargo_last60daysmovement");
            linjer60dager.setLayer("norago_last60daysmovement_dev_noView");
           // valuesList.add(0, linjer60dager);

            
        }
        return valuesList;
    } 
    
//    @RequestMapping("/getNorArgoChildNodes.html")
    public String getNorArgoChildNodesTest () {
        return "norArgoChildNodesDummy";
    }
    
    @RequestMapping("/testJSONLoader.html")
    public String testJSONLoader () {
        return "testJSONLoader";
    }
    
    @RequestMapping("/wmscap.xml")
    public String wmscap () {
        return "wmscap";
    }
    
    
     
    @RequestMapping(value="/getNorArgoFloatData", method = RequestMethod.GET)
    public @ResponseBody List getFloatData(@RequestParam("id") String platformID,
            @RequestParam("date") String date
            ) {
       
        return dao.getFloatMeasurements(platformID,date);
    }

    @RequestMapping(value="/getNorArgoFloatMeasureTypes", method = RequestMethod.GET)
    public @ResponseBody List getFloatDataTypes(@RequestParam("id") String platformID,
            @RequestParam("date") String date
            ) {
        return dao.getFloatMeasurementTypes(platformID,date);
    }

  
    @RequestMapping(value="/norArgo/platformMeaurement/metaData", method = RequestMethod.GET)
    public @ResponseBody Object getPlatformMeaurement(@RequestParam("id") String platformID
            ) {
        return dao.getPlatformInfo(platformID);
    }

    @RequestMapping(value="/norArgo/platformMeaurement", method = RequestMethod.GET)
    public @ResponseBody Map getPlatformMeaurementValue(@RequestParam("id") String platformID,
                @RequestParam("date") String date) {
        return dao.getPlatformProfile(platformID,date);
    }

    
  
     @RequestMapping(value="/getNorArgoFloatChart", method = RequestMethod.GET)
     public void getFloatChart(@RequestParam("id") String platformID,
            @RequestParam("date") String date,
            @RequestParam("measureType") String measureType,
            @RequestParam("width") int width,
            @RequestParam("height") int  height,

            HttpServletResponse httpServletResponse
            ) {
       
        ///return dao.getFloatMeasurements(platformID,date);
        XYSeries chartSeries = new XYSeries("depth");
        List<DepthMeasurementValue> chartData = dao.getFloatMeasurements(platformID, date,measureType);
        for (DepthMeasurementValue depthMeasure:chartData) {
            chartSeries.add(depthMeasure.getDepth(),depthMeasure.getValue());
        }
       XYSeriesCollection chartDataset = new XYSeriesCollection(chartSeries); 
        
        JFreeChart chart = ChartFactory.createXYLineChart(null, "depth",measureType,chartDataset, PlotOrientation.VERTICAL, false, false, false);
        
        XYPlot plot = chart.getXYPlot();
       
        plot.setOrientation(PlotOrientation.HORIZONTAL);
        plot.getDomainAxis().setInverted(true);
        
        XYLineAndShapeRenderer renderer = new XYLineAndShapeRenderer();
        renderer.setSeriesPaint(0, Color.BLUE);
        renderer.setSeriesShapesVisible(0,false);
        plot.setRenderer(renderer);
       
        NumberAxis axis = (NumberAxis) plot.getRangeAxis();
        axis.setAutoRangeIncludesZero(false);
        axis.configure();

        byte[] pngChart;
        try {
            pngChart = EncoderUtil.encode(chart.createBufferedImage(width, height), "png");
            httpServletResponse.setContentType("image/png");
    httpServletResponse.setContentLength(pngChart.length);
    httpServletResponse.getOutputStream().write(pngChart);
    httpServletResponse.getOutputStream().close();

        } catch (IOException ex) {
            Logger.getLogger(NorArgo.class.getName()).log(Level.SEVERE, null, ex);
        }
}
     
    
    @RequestMapping(value = "/foo", method = RequestMethod.POST)
    public String foo(   @RequestBody DepthMeasurementValue  d,
            ModelMap model) {
         Logger.getLogger(NorArgo.class.getName()).log(Level.SEVERE,"Got"+d.getValue());
        
        
        return "/";
    }

    @RequestMapping(value = "/fool")
    public String fool(   @ModelAttribute(value = "sampleList") DepthMeasurementValue  d,
            ModelMap model) {
   
        
        
        return "/";
    }
    
}
