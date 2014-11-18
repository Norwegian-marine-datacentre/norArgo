package no.imr.geoexplorer.arctic.roos.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import no.imr.geoexplorer.arctic.roos.pojo.ArcticRoosPojo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * 
 * @author endrem
 *
 */
@Controller
public class ArcticRoos {

    @RequestMapping("/arctic-roos.html")
    public ModelAndView arcticRoos(HttpServletResponse resp) throws IOException {
    	return new ModelAndView("arctic-roos");
    }
    
	@RequestMapping("/getChildNodes")
    public @ResponseBody List<ArcticRoosPojo> getChildNodesAsJson(HttpServletRequest request, @RequestParam("node") String node) {
		ArrayList<ArcticRoosPojo> l = new ArrayList<ArcticRoosPojo>();
		if (node.contains("xnode")) {
			ArcticRoosPojo GTS_Bathy  = new ArcticRoosPojo();
			GTS_Bathy.setId( 1l );
			GTS_Bathy.setText( "GTS Bathy" );
			GTS_Bathy.setLeaf(true);
			
			ArcticRoosPojo CTD_profiles  = new ArcticRoosPojo();
			CTD_profiles.setId( 2l );
			CTD_profiles.setText( "CTD profiles" );
			CTD_profiles.setLeaf(true);
			
			ArcticRoosPojo drifting_buoys   = new ArcticRoosPojo();
			drifting_buoys.setId( 3l );
			drifting_buoys.setText( "Drifting buoys" );
			drifting_buoys.setLeaf(true);
			
			ArcticRoosPojo ferrybox    = new ArcticRoosPojo();
			ferrybox.setId( 4l );
			ferrybox.setText( "Ferrybox" );
			ferrybox.setLeaf(true);
			
			ArcticRoosPojo moorings     = new ArcticRoosPojo();
			moorings.setId( 5l );
			moorings.setText( "Moorings" );
			moorings.setLeaf(true);
			
			ArcticRoosPojo WOD_CTD      = new ArcticRoosPojo();
			WOD_CTD.setId( 6l );
			WOD_CTD.setText( "WOD CTD" );
			WOD_CTD.setLeaf(true);
			
			ArcticRoosPojo profiling_floats      = new ArcticRoosPojo();
			profiling_floats.setId( 7l );
			profiling_floats.setText( "Profiling floats" );
			profiling_floats.setLeaf(true);
			
			ArcticRoosPojo GTS_TESAC       = new ArcticRoosPojo();
			GTS_TESAC.setId( 8l );
			GTS_TESAC.setText( "GTS_TESAC" );
			GTS_TESAC.setLeaf(true);
			
			ArcticRoosPojo XBT = new ArcticRoosPojo();
			XBT.setId( 9l );
			XBT.setText( "XBT or XCTD profiles" );		
			XBT.setLeaf(true);
			
			l.add(GTS_Bathy);
			l.add(CTD_profiles);
			l.add(drifting_buoys);
			l.add(ferrybox);
			l.add(moorings);
			l.add(WOD_CTD);
			l.add(profiling_floats);
			l.add(GTS_TESAC);
			l.add(XBT);
		}
		return l;
	}
	
	@RequestMapping("/getArcticRoosData")
	public ModelAndView showMessageBoxWithDepthAndTime(
			@RequestParam("parameter_id") String parameterId,
			HttpServletRequest request) throws Exception {
		return null;
	}
}
