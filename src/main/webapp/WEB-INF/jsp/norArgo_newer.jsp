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
                
                app.on("ready0", function() {
                    var treeRoot = Ext.getCmp('layers');
                    var root = treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
                        text: 'NorArgo',
                        loader: new Ext.tree.TreeLoader({
                            url: 'spring/getNorArgoChildNodes.html',
                            createNode: function(attr) {
                                attr.nodeType = "gx_layer";
                                attr.layer = new OpenLayers.Layer.WMS(attr.text, "http://maps.imr.no/geoserver/wms?", {
                                    layers: 'norargo_all_points',
                                    transparent: 'TRUE'
                                }, {
                                    displayInLayerSwitcher: false,
                                    visibility: false,
                                    isBaseLayer: false
                                });
                                app.mapPanel.map.addLayer(attr.layer);
                                return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
                            }
                        })
                    }));
                });                
                
                /*{name: "name", type: "string"},
                {name: "source", type: "string"}, 
                {name: "group", type: "string"},
                {name: "fixed", type: "boolean"},
                {name: "selected", type: "boolean"},
                {name: "type", type: "string"},
                {name: "args"},
                {name: "queryable", type: "boolean"}*/
                
                app.on("ready1", function() {
                    var treeRoot = Ext.getCmp('layers');
                    var root = treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
                        text: 'NorArgo',
                        loader: new Ext.tree.TreeLoader({
                            url: 'spring/getNorArgoChildNodes.html',
                            createNode: function(attr) {
                                attr.nodeType = "gx_layer";
                                var record = app.layerSources.local.createLayerRecord({
                                    name: 'usa:states',
                                    title: 'usa:states',
                                    visibility: false,
                                    bbox: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
                                });
                                record.getLayer().addOptions({displayInLayerSwitcher: false});
                                app.mapPanel.layers.add(record);
                                //app.mapPanel.layers.add(attr.layer);  //funker
                                attr.layer = record.getLayer();
                                return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
                            }
                        })
                    }));
                });
                
                app.on("ready", function() {
                    var treeRoot = Ext.getCmp('layers');
                    var root = treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
                        text: 'NorArgo',
                        loader: new Ext.tree.TreeLoader({
                            //url: 'http://localhost/git/getNorArgoChildNodes.html',
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
                                
                                app.mapPanel.layers.add(record);
//                                 app.mapPanel.layers.add(attr.layer);  //funker
                                attr.layer = record.getLayer();
                                gxp.plugins.WMSGetFeatureInfo.prototype.layerParams = ["viewparams"];
                                return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
                            }
                        })
                    }));
                });
  
                
                app.on("tmpready", function() {
                    var treeRoot = Ext.getCmp('layers');
                    
                    var root = treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
                        text: 'NorArgo',
                        loader: new Ext.tree.TreeLoader({
                       	    url: 'spring/getNorArgoChildNodes.html', 
                       	    createNode: function(attr) {
                            attr.checked = attr.leaf ? false : undefined;
                            attr.render = false;
                            // TODO set attr.layer - adding OLRecord
                            if ( attr.leaf ) {
                                attr.nodeType = "gx_layer";
                                attr.disabled = false;
                                attr.render = true;
	                            var OLRecord = gxp.plugins.OLSource.prototype.createLayerRecord({
	                                source: "ol",
	                                type: "OpenLayers.Layer.WMS",
	                                group: "group",
	                                queryable: true,
	                                visibility: true,  
	                                properties: "gxp_wmslayerpanel",
	                                args: [
	                                       "norargo_points",
	                                       MAPS_IMR_NO,
	                                       {layers: "norargo_points", format: "image/png", transparent: true},
	                                       {
	                                           opacity: 1,
	                                           units: "m",
	                                           singleTile:true,
	                                           buffer: 0, //getting no boarder around image - so panning will get a new image.
	                                           ratio: 1 //http://dev.openlayers.org/releases/OpenLayers-2.12/doc/apidocs/files/OpenLayers/Layer/Grid-js.html#OpenLayers.Layer.Grid.ratio                                        
	                                       }
	                                ]
	                            });        
	                            attr.layer = OLRecord.getLayer();
	                            layers.push(OLRecord.getLayer());
	                            attr.layer.setVisibility(true);
	                            var treeLoaderNode = Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
// 	                            return treeLoaderNode;
//                              GeoExt.tree.LayerLoader.prototype.createNode.apply(this, attr); 

                                var store = new GeoExt.data.LayerStore();
                                store.add(OLRecord);
                                var layerLoader = new GeoExt.tree.LayerLoader({
                                    store: store,
                                    createNode: function(attr) {
                                        var layerRecord = this.store.getByLayer(attr.layer);
                                        layerRecord.getLayer().setVisibility(true);
                                        var tmp = layerRecord.data;
                                        var tmpp = tmp.layer;
                                        layerss = app.mapPanel.layers; 
//                                         app.mapPanel.layers.add(tmpp);   
                                        var node = GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
                                        node.on("checkchange", function(event) {
                                        	node.ui.toggleCheck(checked);
                                            var layer = layerRecord.getLayer();
                                            var record = event.layerStore.getByLayer(layer);
                                            record.getLayer().setVisibility(true);
                                            app.mapPanel.layers.add(record);
                                        });
                                    }
                                });
                                var layerContainerGruppe = new GeoExt.tree.LayerContainer({
                                    checked: false,
                                    expanded: true,     
//                                     text: "gruppeText", 
                                    text: "Overlays",
                                    layerStore: store,
                                    loader: layerLoader
                                });
                                layerContainerGruppe.disabled = false;
	                            return layerContainerGruppe;
                            }
                            return attr;
                        }})
                    }));
                    treeRoot.getRootNode().appendChild( root );
                    
                    var layerStore = null;
                    var layerLoader = null;
                    treeRoot.on('tclick', function(record, view, item, index, evt, eOpts) {
                        if ( layerStore == null ) {
                            
                            layerStore = new GeoExt.data.LayerStore();
                            layerStore.add(layers);
                            
                            layerLoader = new GeoExt.tree.LayerLoader({
                                text: 'layerloader',
                                store: layerStore,
                                createNode: function(attr) {
                                    var layerRecord = this.store.getByLayer(attr.layer);
                                    var node = GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr); 
                                    node.checked = false;
                                    node.on("checkchange", function(event) {
                                        var layer = layerRecord.getLayer();
                                        var record = event.layerStore.getByLayer(layer);
                                        record.getLayer().setVisibility(true);
                                        app.mapPanel.layers.add(record);    
                                    });
                                    return node;
                                 }
                            });                
                        }                           
                        
                        var layerContainer = new GeoExt.tree.LayerContainer({
                            expanded: true,     
                            text: 'gruppe',                               
                            layerStore: layerStore,
                            loader: layerLoader
                        }); 
                        mergedSomeHovedtema = new Ext.tree.TreeNode({
                            text: "hovedtema"
                        });   
                        mergedSomeHovedtema.appendChild( layerContainer );
                    
                        treeRoot.getRootNode().appendChild( layerContainer );
                    });
                    
                    treeRoot.on('tmpclick', function(record, view, item, index, evt, eOpts) {
                        var mapPanel = Ext.ComponentMgr.all.find(function(c) {
                            return c instanceof GeoExt.MapPanel;
                        });
                        var postGisLayer = null;
                        
                        var layername;
                        var layerText;
                        var id;
                        var sqlParam;
                        if ( record.text == "Punkter" ) {
                            id = record.attributes.idPlatform;
                            sqlParam = 'id_platform:' + id;                         
                            layername = "norargo_points";
                            layerText = record.parentNode.attributes.text + "Punkter";
                        } else if( record.text == "Linjer") {
                            id = record.attributes.id;
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
                        var map = mapPanel.map;
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
