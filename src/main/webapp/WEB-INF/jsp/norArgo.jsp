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
        <script type="text/javascript" src="javascript/createOLSourceLayerRecord.js"></script>

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
                        maxExtent: [-4E7, -4E7, 4E7, 4E7],
                        numZoomLevels: 18,
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
                        center: [0,0],
                        zoom: 3
                    }
                });
                
                var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";
                var layers = [];
                
                app.on("ready", function() {
                    var treeRoot = Ext.getCmp('layers');
                    var root = treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
                        text: 'NorArgo',
                        loader: new Ext.tree.TreeLoader({
                            url: 'spring/getNorArgoChildNodes.html',
                            createNode: function(attr) {
                                attr.nodeType = "gx_layer";
                                
                                var layerText;
                                var sqlParam;
                                if ( attr.text == "Punkter" ) {
                                    var id = attr.idPlatform;
                                    sqlParam = 'id_platform:' + id;                         
                                    layerText = "Punkter";
                                } else if( attr.text == "Linjer") {
                                    var id = attr.id;
                                    sqlParam = 'id:' + id;
                                    layerText = "Linjer";
                                } 
                                
                                var record = app.layerSources.ol.createLayerRecord({
                                    type: 'OpenLayers.Layer.WMS', 
                                    args: [
                                           attr.text, 
                                           MAPS_IMR_NO, 
                                           {
                                               LAYERS: attr.layer, 
                                               TRANSPARENT: 'TRUE',
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
                                app.mapPanel.layers.insert(0, [record]);
                                attr.layer = record.getLayer();
                                return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
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