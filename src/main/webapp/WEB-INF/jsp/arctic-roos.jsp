<!DOCTYPE HTML SYSTEM>
<%@page pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<html>
    <head>
        <title>Arctic Roos</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!--         <link rel="shortcut icon" href="theme/app/img/mareanoLogo.png"> -->
        <!-- Ext resources -->
        <link rel="stylesheet" type="text/css" href="externals/ext/resources/css/ext-all.css">
        <link rel="stylesheet" type="text/css" href="externals/ext/resources/css/xtheme-gray.css">
        <!-- script type="text/javascript" src="externals/ext/adapter/ext/ext-base-debug.js"></script -->
        <script type="text/javascript" src="externals/ext/adapter/ext/ext-base.js"></script>
        <!-- script type="text/javascript" src="externals/ext/ext-all-debug-w-comments.js"></script -->
        <script type="text/javascript" src="externals/ext/ext-all.js"></script>
			
        <meta http-equiv="X-UA-Compatible" content="IE=IE8" >
        <!--script type="text/javascript" src="javascript/googleAnalyticsStatistics.js"></script -->

	    <script type="text/javascript" src="javascript/jquery-1.6.2.min.js"></script>    	
	    <script type="text/javascript">jQuery.noConflict();</script>
	    
        <!-- gxp resources -->
        <link rel="stylesheet" type="text/css" href="externals/gxp/src/theme/all.css">

        <!-- GeoExplorer resources -->
        <link rel="stylesheet" type="text/css" href="theme/app/geoexplorer.css" />
        <!--[if IE]><link rel="stylesheet" type="text/css" href="theme/app/ie.css"/><![endif]-->
        <link rel="stylesheet" type="text/css" href="theme/ux/colorpicker/color-picker.ux.css" />
        <script type="text/javascript" src="script/GeoExplorer.js"></script>
        
        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles0098.css" />
        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles2714.css" />
        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles4755.css" />

        <script>
        	var app;
            function init() {
                gxp.plugins.LayerTree.prototype.baseNodeText = "Base Layer";
                gxp.plugins.LayerTree.prototype.overlayNodeText = "Overlays";
                                
                //Ext.BLANK_IMAGE_URL = "theme/app/img/blank.gif";
                OpenLayers.ImgPath = "theme/app/img/";
                GeoExt.Lang.set('en');
                app = new GeoExplorer.Composer({
                    <!-- authStatus: < status >, -->
                    proxy: "proxy/?url=",
                    printService: null,
                    about: {
                        title: "Mareano",
                        "abstract": "Copyright (C) 2005-2013 Mareano. Map projection WGS84, UTM 33 N",
                        contact: "For more information, contact <a href='http://www.imr.no'>Institute of Marine Research</a>."
                    },
                    defaultSourceType: "gxp_wmscsource",
                    sources: {
                        ol: {
                            ptype: "gx_olsource"
                        }                   
                    },
                    map: {
                    	projection: "EPSG:3575",
                    	units: "m",
                    	maxResolution: 115832.0,
                    	maxExtent: [-1.2741977029190743E20,-1.2741906468843322E20,1.274199046811774E20,1.2742013988510262E20],
                    	numZoomLevels: 18,
                        layers: [
						{
							source: "ol",
                            type: "OpenLayers.Layer.WMS",
                            group: "background",
							args: [
                   				"Arctic",
                   				"http://maps.imr.no/geoserver/wms",
                   				{layers: "WORLD_NP_LAEA_WGS84", format: "image/jpeg", transparent: true, isBaseLayer: true}
                        	]
           				}    
                        ],
                        center: [0,0],
                        zoom: 3
                    }
                });
                
                app.on("ready", function() {
                    var treeRoot = Ext.ComponentMgr.all.find(function(c) {
                        return c instanceof Ext.tree.TreePanel;
                    });
                    
                    treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
                        text: 'arctic-roos',
                        loader: new Ext.tree.TreeLoader({url: 'spring/getChildNodes'})
                    }));
                    treeRoot.on('click', function(record, view, item, index, evt, eOpts) {
						
						var mapPanel = Ext.ComponentMgr.all.find(function(c) {
			                return c instanceof GeoExt.MapPanel;
			            });
						var postGisLayer = null;
						var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";

                   	    var typeValue = "";
                   	    var style = "";
						if ( record.attributes.id == 1 ) {
							typeValue = "BA";
							style = "arcticroos_gtsbathy";
                   	 	} else if ( record.attributes.id == 2 ) {
                   	 		typeValue = "CT";
                   	 		style = "arcticroos_ctd";
                   	 	} else if ( record.attributes.id  == 3 ) {
                   	 		typeValue = "DB";
                   	 		style = "arcticroos_driftingbouy";
                   	 	} else if ( record.attributes.id  == 4 ) {
                   	 		typeValue = "FB";
                   	 		style = "arcticroos_ferrybox";
                   	 	} else if ( record.attributes.id  == 5 ) {
                   	 		typeValue = "MO";
                   	 		style = "arcticroos_mooring ";
                   	 	} else if ( record.attributes.id  == 6 ) {
                   	 		typeValue = ""; // trolig fjernes
                   	 	} else if ( record.attributes.id  == 7 ) {
                   	 		typeValue = "PF";
                   	 		style = "arcticroos_profiling_floats";
                   	 	} else if ( record.attributes.id  == 8 ) {
                   	 		typeValue = "TE";
                   	 		style ="arcticroos_gtstesac";
                   	 	} else if ( record.attributes.id  == 9 ) {
                   	 		typeValue = "XB";	
                   	 		style ="arcticroos_xbt_xctd";
                   	 	}

                   	    var felayer = new OpenLayers.Layer.WMS(
                   			"measurements_last_30_days",
                   			MAPS_IMR_NO,
                   	        {
                   	    		layers: "measurements_last_30_days",
                   		        transparent: true,
                   		        styles: style
                   	        },
                   		    {
                   	        	isBaseLayer: false
                   	        }
                   	    );
                   	 	felayer.mergeNewParams({ viewparams : 'type:'+typeValue });
                   	 	mapPanel.map.addLayer(felayer);
	                     	    
                   	    /** dns redirect to crius.nodc.no/geoserver/wms */
                   	    var src = MAPS_IMR_NO + "service=WMS&version=1.1.1&request=GetLegendGraphic&layer=" +
                   	 		"measurements_last_30_days" + "&width=22&height=24&format=image/png";
                   	    jQuery("#legend").attr("src",src);                                   	        
					});          
                });                
            }
        </script>
    </head>
    <body onload="init()">
    </body>
</html>
