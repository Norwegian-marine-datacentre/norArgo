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
        <script type="text/javascript" src="externals/ext/ext-all-debug-w-comments.js"></script>
        <!-- script type="text/javascript" src="externals/ext/ext-all.js"></script -->
            
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
        
        
        <script src="http://code.highcharts.com/highcharts.js"></script>
        <script type="text/javascript" src="javascript/norArgoTools.js"></script>

        <script type="text/javascript" src="javascript/createOLSourceLayerRecord.js"></script>

        <script>
            var app;
            function init() {
                                  
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
		//      maxResolution: 115832.0,
			maxResolution: 	14479.0,
			maxExtent: [-4E7, -4E7, 4E7, 4E7],
                        numZoomLevels: 10,
                        wrapDateLine: false,
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
			//                        center: [ 0,0],
			center: [-1514367.8917845,-2035476.4551685],
			//center: [-517363.6417845,-2106729.6426685],
                        zoom: 1
                    }
                });

		function createProfileLayer(name,layerName,visible) {
		    var result =  app.layerSources.ol.createLayerRecord({
                        type: 'OpenLayers.Layer.WMS', 
                        queryable: true,
                        args: [
                            name, 
                            MAPS_IMR_NO, 
                            {
                                LAYERS: layerName,
                                TRANSPARENT: 'TRUE',
                                viewparams : "",
				isProfile: true
                            }, 
                            {
                                displayInLayerSwitcher: false, 
                                isBaseLayer: false
                            }
                        ],
                        visibility: visible
                    });
		    app.mapPanel.layers.insert(0,[result]);
		    return result;
		}
		
		
                var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";
               // var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";
                 
                var layers = [];
                
                app.on("ready", function() {
		    
               //Inject custom buttons
               //  var p = new ProfileDisplay();
                ProfileDisplay.attachTo(app.mapPanel);
                    var treeRoot = Ext.getCmp('layers').getRootNode();
		    var floatsTree = new Ext.tree.TreeNode({
			text:'NorArgo',
			expanded:true});
		    treeRoot.replaceChild(floatsTree,treeRoot.childNodes[0]);

		    var layer;
		    var node;
		    
		    layer =   createProfileLayer("Alle floats","norago_last60days_point_dev",true); 
		    node = {nodeType:"gx_layer","leaf":true,"text":"Alle floats","layer":layer.getLayer(),"id":"sist60_point"}
		    floatsTree.appendChild(node);
		    
		    layer =   createProfileLayer("Siste 60 dager path","norago_last60daysmovement_dev_noView",true); 
		    node = {nodeType:"gx_layer","leaf":true,"text":"Siste 60 dager","layer":layer.getLayer(),"id":"sist60"}
		    floatsTree.appendChild(node);
		    
		    layer =   createProfileLayer("Alle floats","norargo_all_points_dev",false); 
		    node = {nodeType:"gx_layer","leaf":true,"text":"Alle floats","layer":layer.getLayer(),"id":"alleFloats"}
//		    floatsTree.appendChild(node);
		    
                    var layerList=[]; 
                    /* For better performance all layers should be added to layer store via one
                     * call to add/insert instead of as they are created.  To this end will push layers
                     * into layerLIst array.
                     */
//		    var root = treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
                    var root = floatsTree.appendChild(new Ext.tree.AsyncTreeNode({
                        text: 'Floats',
                        loader: new Ext.tree.TreeLoader({
                            url: 'spring/getNorArgoChildNodes.html',
                            createNode: function(attr) {
                                attr.nodeType = "gx_layer";
                                
                                var layerText;
                                var sqlParam;
				var profile;
                                if ( attr.text == "Punkter" ) {
                                    var id = attr.idPlatform;
                                    sqlParam = 'id_platform:' + id;                         
                                    layerText = "Punkter";
				    profile = true;
                                } else if( attr.text == "Linjer") {
                                    var id = attr.id;
                                    sqlParam = 'id:' + id;
                                    layerText = "Linjer";
				    profile = false;
                                } 
                                
                                var record = app.layerSources.ol.createLayerRecord({
                                    type: 'OpenLayers.Layer.WMS', 
                                    queryable: true,
                                    args: [
                                           attr.text, 
                                           MAPS_IMR_NO, 
                                           {
                                               LAYERS: attr.layer, 
                                               TRANSPARENT: 'TRUE',
					       isProfile: profile,
                                               viewparams : sqlParam
                                           }, 
                                           {
                                               displayInLayerSwitcher: false, 
                                               isBaseLayer: false
                                           }
                                    ],
                                    visibility: false
                                });
                                gxp.plugins.WMSGetFeatureInfo.prototype.layerParams = ["viewparams"];

                                //app.mapPanel.layers.add(record);
                                //app.mapPanel.layers.insert(0, [record]);
                                if (layerList) {
                                   layerList.push(record);
                                } else {
                                    app.mapPanel.layers.insert(0,[record]);
                                }   
                                attr.layer = record.getLayer();
                                return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
                            },
                            listeners : {
                                load: function(){ // Event fires after nodes are loaded
                                     var firstLayer = layerList.pop();
                                    app.mapPanel.layers.add(layerList) ; // Add all excepted first layer via add function for speed
                                    app.mapPanel.layers.insert(0,firstLayer); // Add first layer via insert to cause all setup events to fire
				    
                                     layerList = false; //Sublayers will be added directly
                                     
                                }
                        }   
                        })
                    }));
                });   
            }
        </script>
    </head>
    <body onload="init()">
    </body>
</html>

