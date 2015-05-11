<!DOCTYPE HTML SYSTEM>
<%@page pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<html>
    <head>
        <title>Jerico</title>
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
        
        <script type="text/javascript" src="javascript/jericoComposer.js"></script>

        <script>
            var app;
            function init() {
                gxp.plugins.LayerTree.prototype.baseNodeText = "Base Layer";
                gxp.plugins.LayerTree.prototype.overlayNodeText = "Overlays";
                                
                //Ext.BLANK_IMAGE_URL = "theme/app/img/blank.gif";
                OpenLayers.ImgPath = "theme/app/img/";
                GeoExt.Lang.set('en');
                app = new Jerico.Composer({
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
                        center: [4E3,-4E6],
                        zoom: 3
                    }                   
                });
                
                app.on("ready", function() {
                    var treeRoot = Ext.ComponentMgr.all.find(function(c) {
                        return c instanceof Ext.tree.TreePanel;
                    });
                    
                    var JERICO = 'Jerico';

                    treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
                        expanded: true,
                        text: JERICO,
                        draggable:false,
                        id:'source',
                        children: [
                            {"leaf":false,"id":2,"text":"Arctic", "expanded":true,
                                "children": [
                                    {"leaf":true, "text":"Arctic Temperature", "area":"Arctic", "comment":"Temperature"},
                                    {"leaf":true, "text":"Arctic Salinity", "area":"Arctic", "comment":"Salinity"},
                                    {"leaf":true, "text":"Arctic Sealevel", "area":"Arctic", "comment":"Sealevel"},
                                    {"leaf":true, "text":"Arctic Wave", "area":"Arctic", "comment":"Wave"}
                                ]
                            },
                            {"leaf":false,"id":6,"text":"BLAC", "expanded":true,
                                "children": [
                                    {"leaf":true, "text":"BLAC Temperature", "area":"BLAC", "comment":"Temperature"},
                                    {"leaf":true, "text":"BLAC Salinity", "area":"BLAC", "comment":"Salinity"},
                                    {"leaf":true, "text":"BLAC Sealevel", "area":"BLAC", "comment":"Sealevel"},
                                    {"leaf":true, "text":"BLAC Wave", "area":"BLAC", "comment":"Wave"}
                                 ]
                            },
                            {"leaf":false,"id":10,"text":"BOOS", "expanded":true,
                                "children": [
                                    {"leaf":true, "text":"BOOS Temperature", "area":"BOOS", "comment":"Temperature"},
                                    {"leaf":true, "text":"BOOS Salinity", "area":"BOOS", "comment":"Salinity"},
                                    {"leaf":true, "text":"BOOS Sealevel", "area":"BOOS", "comment":"Sealevel"},
                                    {"leaf":true, "text":"BOOS Wave", "area":"BOOS", "comment":"Wave"}
                                 ]
                            },                                  
                            {"leaf":false,"id":14,"text":"IBI", "expanded":true,
                                "children": [
                                    {"leaf":true, "text":"IBI Temperature", "area":"IBI", "comment":"Temperature"},
                                    {"leaf":true, "text":"IBI Salinity", "area":"IBI", "comment":"Salinity"},
                                    {"leaf":true, "text":"IBI Sealevel", "area":"IBI", "comment":"Sealevel"},
                                    {"leaf":true, "text":"IBI Wave", "area":"IBI", "comment":"Wave"}
                                 ]
                            },
                            {"leaf":false,"id":18,"text":"MON", "expanded":true,
                                "children": [
                                    {"leaf":true, "text":"MON Temperature", "area":"MON", "comment":"Temperature"},
                                    {"leaf":true, "text":"MON Salinity", "area":"MON", "comment":"Salinity"},
                                    {"leaf":true, "text":"MON Sealevel", "area":"MON", "comment":"Sealevel"},
                                    {"leaf":true, "text":"MON Wave", "area":"MON", "comment":"Wave"}
                                 ]
                            },
                            {"leaf":false,"id":22,"text":"NOOS", "expanded":true,
                                "children": [
                                    {"leaf":true, "text":"NOOS Temperature", "area":"NOOS", "comment":"Temperature"},
                                    {"leaf":true, "text":"NOOS Salinity", "area":"NOOS", "comment":"Salinity"},
                                    {"leaf":true, "text":"NOOS Sealevel", "area":"NOOS", "comment":"Sealevel"},
                                    {"leaf":true, "text":"NOOS Wave", "area":"NOOS", "comment":"Wave"}
                                 ]
                            },
                            {"leaf":false,"id":26,"text":"All", "expanded":true,
                                "children": [
                                    {"leaf":true, "text":"All Temperature", "area":"All", "comment":"Temperature"},
                                    {"leaf":true, "text":"All Salinity", "area":"All", "comment":"Salinity"},
                                    {"leaf":true, "text":"All Sealevel", "area":"All", "comment":"Sealevel"},
                                    {"leaf":true, "text":"All Wave", "area":"All", "comment":"Wave"}
                                 ]
                            }
                        ],
                        leaf: false
                    }));
					
                    treeRoot.on('click', function(record, view, item, index, evt, eOpts) {
                        
                        if (record.text == JERICO) {
                            return;
                        }
                        
                        var mapPanel = Ext.ComponentMgr.all.find(function(c) {
                            return c instanceof GeoExt.MapPanel;
                        });
                        var postGisLayer = null;
                        var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";
                        
//                         var sqlParam = "";
//                         if (record.area == "All") {
//                         	sqlParam = "";
//                         } else {
//                         	sqlParam = record.text;
//                         }
                        var felayer = new OpenLayers.Layer.WMS(
                        	record.text,
                            MAPS_IMR_NO,
                            {
                                layers: "jerico",
                                transparent: true
                            },
                            {
                                isBaseLayer: false
                            }
                        );
                        if (record.attributes.area != "All") {
                            felayer.mergeNewParams({ viewparams:'type:'+record.attributes.area + ';comment:'+record.attributes.comment });
                            gxp.plugins.WMSGetFeatureInfo.prototype.layerParams = ["viewparams"];
                        } else {
                            felayer.mergeNewParams({ viewparams:'type:' + "%%" + ';comment:'+record.attributes.comment });
                            gxp.plugins.WMSGetFeatureInfo.prototype.layerParams = ["viewparams"];                        	
                        }
                        
                        var geoExtRecord = GeoExt.data.LayerRecord.create();
                        var r =  new geoExtRecord({layer: felayer, title: felayer.name}, felayer.id)
                        r.set('queryable', true);
                        mapPanel.layers.add(r);

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
