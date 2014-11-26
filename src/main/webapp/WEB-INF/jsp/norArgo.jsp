<!DOCTYPE HTML SYSTEM>
<%@page pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<html>
    <head>
        <title>NorArgo</title>
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
        <script type="text/javascript" src="script/GeoExplorer-debug.js"></script>
        
        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles0098.css" />
        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles2714.css" />
        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles4755.css" />
        
        <script type="text/javascript" src="javascript/norArgoComposer.js"></script>

        <script>
            var app;
            function init() {
                gxp.plugins.LayerTree.prototype.baseNodeText = "Base Layer";
                gxp.plugins.LayerTree.prototype.overlayNodeText = "Overlays";
                                
                //Ext.BLANK_IMAGE_URL = "theme/app/img/blank.gif";
                OpenLayers.ImgPath = "theme/app/img/";
                GeoExt.Lang.set('en');
                app = new NorArgo.Composer({
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
                                {layers: "WORLD_NP_LAEA_WGS84", format: "image/jpeg", transparent: true, isBaseLayer: true, styles: "arcticroos_contry"}
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
                        text: 'NorArgo',
                        loader: new Ext.tree.TreeLoader({url: 'spring/getNorArgoChildNodes.html'})
                    }));                    
                    
                    treeRoot.on('click', function(record, view, item, index, evt, eOpts) {
                        
                        var mapPanel = Ext.ComponentMgr.all.find(function(c) {
                            return c instanceof GeoExt.MapPanel;
                        });
                        var postGisLayer = null;
                        var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";
                        
                        var layername;
                        var layerText
                        var sqlParam
                        if ( record.text == "Punkter" ) {
                            var id = record.attributes.idPlatform;
                            sqlParam = 'id_platform:' + id;                        	
                        	layername = "norargo_points";
                        	layerText = record.parentNode.attributes.text + "Punkter";
                        } else if( record.text == "Linjer") {
                        	var id = record.attributes.id;
                        	sqlParam = 'id:' + id;
                        	layername = "norargo_lines";
                        	layerText = record.parentNode.attributes.text + "Linjer";
                        } 
                        	
                        
                        var felayer = new OpenLayers.Layer.WMS(
                        	layerText,
                            MAPS_IMR_NO,
                            {
                                layers: layername,
                                transparent: true, 
                                viewparams : sqlParam
                            },
                            {
                                isBaseLayer: false
                            }
                        );
                        
                        if ( record.text == "Alle floats") {
                            layername = "norargo_all_points";
                            layerText = "NorArgo alle punkter";
                            felayer = new OpenLayers.Layer.WMS(
                                layerText,
                                MAPS_IMR_NO,
                                {
                                    layers: layername,
                                    transparent: true
                                },
                                {
                                    isBaseLayer: false
                                }
                            );
                            
                            gxp.plugins.WMSGetFeatureInfo.prototype.layerParams = ["viewparams"];
                        }
                        
                        var geoExtRecord = GeoExt.data.LayerRecord.create();
                        var r =  new geoExtRecord({layer: felayer, title: felayer.name}, felayer.id)
                        r.set('queryable', true);
                        mapPanel.layers.add(r);
                        
                        // now move the markers to the top of the stack 
                        // change the order of the new layer with norargo_all_points
                        var map = mapPanel.map
                        var yourMarkers = map.getLayersByName("NorArgo alle punkter")[0];
                        if ( record.text != "Alle floats" && yourMarkers != null) {
                        	var layerIndex = map.getLayerIndex(yourMarkers);
                        	var layerIndex2 = map.getLayerIndex(felayer);
                        	map.setLayerIndex(felayer,layerIndex);
                        	map.setLayerIndex(yourMarkers,layerIndex2); 
                        }
                        

                        var src = MAPS_IMR_NO + "service=WMS&version=1.1.1&request=GetLegendGraphic&layer=" +
                            "norargo_point" + "&width=22&height=24&format=image/png";
                        jQuery("#legend").attr("src",src);                                              
                    });          
                });                
            }
        </script>
    </head>
    <body onload="init()">
    </body>
</html>
