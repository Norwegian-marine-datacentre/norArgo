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
        <script type="text/javascript" src="script/GeoExplorer-debug.js"></script>


        <script src="http://code.highcharts.com/highcharts.js"></script>
        <script type="text/javascript" src="javascript/arcticRoosTools.js"></script>

        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles0098.css" />
        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles2714.css" />
        <link rel="stylesheet" type="text/css" href="javascript/ploneStyles4755.css" />

        <script type="text/javascript" src="javascript/arcticRoosComposer.js"></script>
        <link rel="stylesheet" type="text/css" href="javascript/arcticRoosHeader.css" />

        <script>
                    var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";
                    var app;
                    function init() {
                        //Ext.BLANK_IMAGE_URL = "theme/app/img/blank.gif";
                        OpenLayers.ImgPath = "theme/app/img/";
                        GeoExt.Lang.set('en');
                        app = new ArcticRoos.Composer({
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
                                            {layers: "WORLD_NP_LAEA_WGS84", format: "image/jpeg", transparent: true, displayInLayerSwitcher: false, xisBaseLayer: true, styles: "arcticroos_contry"}
                                        ]
                                    }
                                ],
                                center: [0, 0],
                                zoom: 3
                            }
                        });


                        function addFloatsLayer(layerData) {
                            var newLayer = new OpenLayers.Layer.WMS(
                                    layerData.name,
                                    MAPS_IMR_NO,
                                    {
                                        layers: "measurements_last_30_days",
                                        transparent: true,
                                        styles: layerData.style,
                                        viewparams: 'type:' + layerData.type
                                    },
                            {
                                isBaseLayer: false,
                                visibility: false

                            }
                            );
                            var record = new GeoExt.data.LayerRecord({layer: newLayer, title: newLayer.name, queryable: true});
                            app.mapPanel.layers.add(record);


                        }
                        app.on("ready", function () {
                            ProfileDisplay.attachTo(app.mapPanel);
                            gxp.plugins.WMSGetFeatureInfo.prototype.layerParams = ["viewparams"];

                            Ext.Ajax.request({
                                url: 'spring/arcticRoos/layers',
                                method: 'GET',
                                success: function (responseObject) {
                                    var layers = Ext.decode(responseObject.responseText);
                                    jQuery.each(layers, function (i, layer) {
                                        addFloatsLayer(layer);
                                    });
                                }});

                        });
                    }
        </script>
    </head>
    <body onload="init()">
        <div id="headerDiv" class="invisible">
            <div id="header" class="without-secondary-menu"><div class="section clearfix">
                    <a href="http://arctic-roos.org/" title="Home" rel="home" id="logo">'
                        <img src="http://arctic-roos.org/sites/default/files/logo-aroos.png" alt="Home" />
                    </a>
                    <div id="name-and-slogan">

                        <div id="site-name">
                            <strong>
                                <a href="http://arctic-roos.org/" title="Home" rel="home" class="hlink" ><span>Arctic Regional Ocean Observing System</span></a>
                            </strong>
                        </div>
                        <div id="site-slogan">
                            - a regional node under EuroGOOS - the European Global Ocean Observing System          </div>
                    </div> <!-- /#name-and-slogan -->'

                </div> 

                </body>
                </html>
