var felayer;

//PROD
var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";

//TEST: on local machine - use your ip address instead of localhost 
//var MAPS_IMR_NO = "http://geb-test.imr.no/geoserver/wms?";

var LAYER_POINTVALUE = "postgis:pointvalue";
var LAYER_AREAVALUE = "postgis:areavalue";
var PUNKTVISNING = "punktvisning";
var AREALVISNING = "arealvisning";

var NORMAR_GRID = 11;

//var NORMAR_MULTIPLE_LAYERS_SELECTED = "Normar2";
var NORMAR_MULTIPLE_LAYERS_SELECTED = "Normar";
//var NORMAR_ONE_LAYER_SELECTED = "Normar1";
var NORMAR_ONE_LAYER_SELECTED = "Normar";

var BASE_URL = location.href.substring(0,location.href.lastIndexOf('/')) + "/spring/";

/**
 * First get parameters to send to server to create SLD.
 * Then from the response send WMS request to geoserver with url to sld
 * Then draw the map - with layer name - the name of parameter, depth and time 
 */
function drawmapNormar() {
	jQuery.support.cors = true;

	var postGisLayer = readNorMarForm();
	
	//request to create sld then draw map
    jQuery.ajax({
        url:"spring/createNormarSld.html",
        data:{
            parameterids: postGisLayer.parameterIds,
            parameterid: postGisLayer.parameterId,
            depth: postGisLayer.depth,
            time: postGisLayer.time,
            displaytype: postGisLayer.displayType
        },
        method: "post",
        success: function(message) {        	
            var mapPanel = Ext.ComponentMgr.all.find(function(c) {
                return c instanceof GeoExt.MapPanel;
            });
            addLayerToMap(message, mapPanel, postGisLayer );
        },
        error: function(req, status, errThrown) {
    		alert("ie error req:"+req+" status:"+status+" errThrown:"+errThrown);
    	}
    });
}

/**
 * To view sql being sent by geoserver run: select * from pg_stat_activity
 */
function addLayerToMap(message, mapPanel, postGisLayer) { 		
	var idOrIds;
	var norMar;
	if ( postGisLayer.parameterIdsForGeoServer.indexOf("\,") != -1 ) {
		idOrIds = postGisLayer.parameterIdsForGeoServer;
		norMar = NORMAR_MULTIPLE_LAYERS_SELECTED;
	} else {
		if ( postGisLayer.parameterIds != "") {//viss listSpeciesIds kun har en verdi så har man valgt dialogboks med flere kartlag men kun valgt ett av datasettene 
			idOrIds = postGisLayer.parameterIdsForGeoServer;
		} else {
			idOrIds = postGisLayer.parameterId;
		}
		norMar = NORMAR_ONE_LAYER_SELECTED;
	}

    felayer = new OpenLayers.Layer.WMS.Post(
		postGisLayer.parameterName + postGisLayer.time + postGisLayer.depth,
    	MAPS_IMR_NO,
        {
    		layers: postGisLayer.baseWmsLayerName + norMar,
	        transparent: true ,
	        sld: BASE_URL + "getsld.html?file=" + message //,
            //viewparams: "parameter_id:"+idOrIds //grid_id=11 is normar grid
        },
	    {
        	isBaseLayer: false
        }
    );
    felayer.mergeNewParams({ viewparams : 'parameter_id:'+idOrIds+";id_grid:"+NORMAR_GRID });
    mapPanel.map.addLayer(felayer);
    
    /** dns redirect to crius.nodc.no/geoserver/wms */
    var src = MAPS_IMR_NO + "service=WMS&version=1.1.1&request=GetLegendGraphic&layer=" +
    	postGisLayer.baseWmsLayerName + norMar + "&width=22&height=24&format=image/png&SLD=" + BASE_URL + "getsld.html?file=" + message;
    jQuery("#legend").attr("src",src);      
}