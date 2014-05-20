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


        <!-- gxp resources -->
        <link rel="stylesheet" type="text/css" href="externals/gxp/src/theme/all.css">

        <!-- GeoExplorer resources -->
        <link rel="stylesheet" type="text/css" href="theme/app/geoexplorer.css" />
        <!--[if IE]><link rel="stylesheet" type="text/css" href="theme/app/ie.css"/><![endif]-->
        <link rel="stylesheet" type="text/css" href="theme/ux/colorpicker/color-picker.ux.css" />
        <script type="text/javascript" src="script/GeoExplorer.js"></script>
        
        <script type="text/javascript" src="javascript/arctic_roos.js"></script>

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
                        projection: "EPSG:32633",
                        units: "m",
                        maxResolution: 10832.0,
                        maxExtent: [-2500000.0,3500000.0,3045984.0,9045984.0],
                        numZoomLevels: 18,
                        wrapDateLine: false,
                        layers: [
                         {
                             source: "ol",
                             type: "OpenLayers.Layer.WMS",
                             group: "background",
                             args: [
                                 "Nautical chart",
                                 "http://maps.imr.no/geoserver/gwc/service/wms",
                                 {layers: "Sjokart_Hovedkartserien2", format: "image/png", transparent: true, isBaseLayer: true}
                                 ,{singleTile:false}
                             ]
                         }, {
                            	source: "ol",
                                type: "OpenLayers.Layer.WMS",
                                group: "background",
                                args: [
                                       "Norway",
                                       "http://wms.geonorge.no/skwms1/wms.toporaster2",
                                       {layers: "toporaster", format: "image/png", transparent: true, isBaseLayer: true}
                                       ,{singleTile:true}
                                ]
                            }, {
                                source: "ol",
                                type: "OpenLayers.Layer.WMS",
                                group: "background",
                                args: [
                                       "Norway (gray scale)",
                                       "http://wms.geonorge.no/skwms1/wms.topo2.graatone",
                                       {layers: "topo2_graatone_WMS", format: "image/png", transparent: true, isBaseLayer: true}
                                       ,{singleTile:true}
                                ]
                            }, {
                                source: "ol",
                                type: "OpenLayers.Layer.WMS",
                                group: "background",
                                args: [
                                     	"Europa",
                                      	"http://maps.imr.no/geoserver/gwc/service/wms",
                                      	{layers: "Europa_WMS", format: "image/jpeg", transparent: true, isBaseLayer: true}
                                      	,{singleTile:false}
                                ]
                            }, {
                                source: "ol",
                                type: "OpenLayers.Layer.WMS",
                                group: "background",
                                args: [
                                      	"Gebco shaded relief in grayscale",
                                      	"http://maps.imr.no/geoserver/gwc/service/wms",
                                      	{layers: "geonorge:geonorge_norge_skyggerelieff", format: "image/jpeg", transparent: true, isBaseLayer: true},
                                      	{singleTile:false}
                                ]                            
                            }, {                            	
                                source: "ol",
                                type: "OpenLayers.Layer.WMS",
                                group: "background",
                                args: [
                                      	"Europa - white background",
                                      	"http://maps.imr.no/geoserver/gwc/service/wms",
                                      	{layers: "geonorge_europa_hvit_bakgrunn",format: "image/jpeg", transparent: true, isBaseLayer: true}
                                      	,{singleTile:false}
                                ]
                            }, {
                               source: "ol",
                               type: "OpenLayers.Layer.WMS",
                               group: "background",
                               args: [
                                     	"Europa og Gebco",
                                     	"http://maps.imr.no/geoserver/gwc/service/wms",
                                     	{layers: "barents_watch_WMS", format: "image/jpeg", transparent: true, isBaseLayer: true}
                                     	,{singleTile:false}
                               ]
                           }	      
                        ],
                        center: [1088474,7489849],
                        zoom: 2
                    }
                });
            }
        </script>
    </head>
    <body onload="init()">
    </body>
</html>
