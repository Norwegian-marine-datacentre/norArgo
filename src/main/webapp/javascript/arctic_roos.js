var silent = false;
var kartlagInfoState = ""; //used by removeLayerLegendAndInfo(mapOfGMLspesialpunkt, kartlagId)

function loadMareano(mapPanel, app) {
	addOverviewMapAndKeyboardDefaults(mapPanel.map);
    app.mapOfGMLspesialpunkt = new Object();        
    
    var layertree = Ext.getCmp("layertree");

    var updateLegendScale = function() {
        layertree.getRootNode().cascade(function(n) {
            var id = n.attributes.layer && n.attributes.layer.metadata['kartlagId'];
            if (id) {
                var legdiv = Ext.get(id);
                if (legdiv !== null) {
                    if (n.disabled === true) {
                        legdiv.addClass('out-of-scale');
                    } else {
                        legdiv.removeClass('out-of-scale');
                    }
                }
            }
        });
    };
    app.mapPanel.on('afterlayout', updateLegendScale);
    app.mapPanel.map.events.register('zoomend', app, updateLegendScale);
    
    layertree.on('startdrag', function() {
    	silent = true;
	});
	layertree.on('dragdrop', function() {
    	silent = false;
	});
    	
    layertree.on('beforeinsert', function(tree, container, node) {
    	node.attributes.iconCls = getLayerIcon(node.layer.url);
    }, this, {single: false});
    // we cannot specify this in outputConfig see: https://github.com/opengeo/gxp/issues/159   
    layertree.on('beforenodedrop', function(event) {
    	// prevent dragging complete folders
        if (!event.dropNode.layer || event.target.text == "Base Layer" ||
        		event.target.parentNode.text == "Base Layer")  {
            return false;
        }
        if (event.source.tree.id === "thematic_tree") {
            var group = event.target.attributes.group || event.target.parentNode.attributes.group;
            var layer = event.dropNode.layer;
            var record = event.dropNode.layerStore.getByLayer(layer);
            var iconCls = event.dropNode.attributes.iconCls;
            var kartlagId = event.dropNode.attributes.id;
            
            if (!layer.map) {
    			record.set("group", group);
    			record.getLayer().setVisibility(true);
            }
            return false;
        }
    }, app);
}

var gfiCache = {};

function addLayerToGroup( gruppeNavn, gruppeText, map, mapPanel, layers, store, app ) {
    var indexOfWMSgruppe = [];
    var layerName = [];
    var childrenVisible = 0;
    var count = 0;    
    for (var i = layers.length-1;i>=0;--i) {
        if ( layers[i].get("group") == gruppeNavn ) {
            count++;
            var idx = mapPanel.layers.findBy(function(record) {
                return record.getLayer().metadata['kartlagId'] === layers[i].getLayer().metadata['kartlagId'];
            });
            if (layers[i].getLayer().visibility === true || idx !== -1) {
                childrenVisible++;
            } 
            layerName.push(layers[i].getLayer().params.LAYERS);
        }
    }

    var groupChecked = (childrenVisible === count);
    var tmpLoader = new GeoExt.tree.LayerLoader({
        store: store,
        filter: function(record) {
            var featureInfoEvents = [];
            /** Add event for getFeatureInfo */
            function setThisHTML(response) {
                var from = response.responseText.indexOf("<body>");
                var to = response.responseText.indexOf("</body>");
                var bodyStr = response.responseText.substring(from, to);
                /** Ugly - fix by not sending request when click outside layer */
                if ( response.responseText != null && response.responseText != "" && bodyStr.length > 14 ) {
                    //Ext.MessageBox.show( 'Feature Info', response.responseText );
                	winPanel = new Ext.Window({title: 'Feature Info',autoHeight: true,width:300,html: response.responseText});
                    winPanel.show();
                    //Ext.MessageBox.show( {title: 'Feature Info', msg: response.responseText, setAutoScroll:true} );
                }
                gfiCache = {};
            };
            var tmpMap = mapPanel.map;
            if (record.get("layer").url!=null && !(record.get("layer") instanceof OpenLayers.Layer.Vector) &&
                record.get("layer").url.indexOf( 'http://maps.imr.no/geoserver/wms' ) != -1 ) {

                var isRegFlag = 0;
                if ( featureInfoEvents != [] ) {
                    for ( var i=0, len=featureInfoEvents.length; i<len; i++ ) {
                        if ( featureInfoEvents[i] == record.get("layer") ) {
                            isRegFlag = 1;
                        }
                    }
                }

                if ( isRegFlag == 0 ) {
                    featureInfoEvents.push( record.get("layer") );
                    tmpMap.events.register('click', record.get("layer"), function (e) {
                        var pressed = false;
                        for (var key in app.tools) {
                            if (app.tools[key].ptype === 'gxp_wmsgetfeatureinfo') {
                                pressed = app.tools[key].actions[0].items[0].pressed;
                                break;
                            }
                        }
                        if (pressed && !gfiCache[record.get("layer").id] && record.get("layer").getVisibility() ) {
                            gfiCache[record.get("layer").id] = true;
                            var params = {
                                REQUEST: "GetFeatureInfo",
                                EXCEPTIONS: "application/vnd.ogc.se_xml",
                                BBOX: tmpMap.getExtent().toBBOX(),
                                X: parseInt(e.xy.x),
                                Y: parseInt(e.xy.y),
                                INFO_FORMAT: 'text/html',
                                QUERY_LAYERS: record.get("layer").params['LAYERS'],
                                FEATURE_COUNT: 50,
                                Layers: record.get("layer").params['LAYERS'],
                                Styles: '',
                                Srs: 'EPSG:32633',
                                WIDTH: tmpMap.size.w,
                                HEIGHT: tmpMap.size.h,
                                format: 'image/jpeg'
                            };
                            var returned = OpenLayers.loadURL("http://maps.imr.no/geoserver/wms", params, this, setThisHTML);
                            //returned.abort(); //to avoid two popups
                            OpenLayers.Event.stop(e);
                        }
                    });
                }
            }
            /** adding matching layer to matching container group */
            for( var i= layerName.length-1; i>=0; --i ) {
                if ( record.get("group") == gruppeNavn) {
                    return true;
                }
            }
            return false;
        },
        createNode: function(attr) {
            var layerRecord = this.store.getByLayer(attr.layer);
            var cssBgImg = "";
            var url = "";
            if ( layerRecord.getLayer() instanceof OpenLayers.Layer.WMS ) {
                url = layerRecord.getLayer().url;
            }
            cssBgImg = getLayerIcon(url);
            attr.iconCls = cssBgImg;
            // if layer already in map, set checked
            var idx = app.mapPanel.layers.findBy(function(record) {
                return record.getLayer().metadata['kartlagId'] === attr.layer.metadata['kartlagId'];
            });
            attr.checked = (layerRecord.getLayer().visibility || (idx !== -1));
            attr.id = layerRecord.data.id;

            attr.autoDisable = false;
            var node = GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);       
            app.mapPanel.layers.on("remove", function(store, record) {
            	if (silent !== true && record.getLayer().metadata['kartlagId'] === attr.layer.metadata['kartlagId']) {
            		node.ui.toggleCheck(false);
            	}
            });            
            node.on("checkchange", function(event) {
                var layer = layerRecord.getLayer();
                var record = event.layerStore.getByLayer(layer);
                var id = layer.metadata['kartlagId'];
                // check if we should also check the parent node
                var setGroupChecked = function(node) {
                    var allChildrenChecked = true;
                    node.parentNode.eachChild(function(child) {
                        if (!child.ui.checkbox.checked) {
                            allChildrenChecked = false;
                        }
                    });
                    node.parentNode.ui.checkbox.checked = allChildrenChecked;
                };
                setGroupChecked(node);
                addKartbildeAbstractOrRemove(node.parentNode, node.parentNode.ui.checkbox.checked);
                // the layer can be associated with multiple nodes, so search the tree
                var origNode = node;
                while (node.parentNode) {
                    node = node.parentNode;
                }
                node.cascade(function(n) {
                    if (n.attributes.layer && n.attributes.layer.metadata['kartlagId'] === id) {
                        n.ui.checkbox.checked = event.ui.checkbox.checked;
                        setGroupChecked(n);
                    }
                });
                node = origNode;
            	if (event.ui.checkbox.checked) {
                    //app.mapPanel.layers.add(record);
                    /** bart code */
                    var doAdd = true;
                    app.mapPanel.layers.each(function(record) {
                        if (record.getLayer().metadata['kartlagId'] === id) {
                            doAdd = false;
                            return false;
                        }
                    });
                    if (doAdd) {
                        var clone = record.clone(); 
                        clone.set("group", "default"); 
                        clone.getLayer().setVisibility(true);
                        clone.getLayer().metadata['kartlagId'] = id;
                        app.mapPanel.layers.add(clone);
//                        var maxExtent = clone.getLayer().maxExtent; //zoom to extent for layers
//                        if (event.ui._silent !== true && maxExtent) {
//                            app.mapPanel.map.zoomToExtent(maxExtent, true);
//                        }
                        displayLegendGraphicsAndSpesialpunkt(app.mapPanel.map.getExtent() + "", layer.metadata['kartlagId'], layerRecord.getLayer(), event, app);
                    }
            	    //app.mapPanel.map.addLayer(layer); //adds layer to Overlay but mareano_wmslayerpanel is missing from properties and no layer properties are shown                        
                	//displayLegendGraphicsAndSpesialpunkt(app.mapPanel.map.getExtent() + "", layer.metadata['kartlagId'], layerRecord.getLayer(), event, app);   
                } else {
            	    removeLayerLegendAndInfo(app.mapOfGMLspesialpunkt, layer.metadata['kartlagId'], record, layer, app);
                }
            });                                    
            return node;
        }
    });
    
    var layerContainerGruppe = new GeoExt.tree.LayerContainer({
    	checked: groupChecked,
        expanded: groupChecked,    	
        text: gruppeText,   
        listeners: {
            "checkchange": function(node, checked) { //setting all subnodes if parent is checked
                var extent = node.attributes.maxExtent;
//                if (extent && checked) { //zoom to extent for pictures
//                    app.mapPanel.map.zoomToExtent(extent, true);
//                }
                node.expand();
//                addKartbildeAbstract(node, checked);
                
                var cs = node.childNodes;
                for(var c = cs.length-1; c >= 0; c--) { //add layers in reverse of reverse order - so in the right order
                    cs[c].ui._silent = true;
                    cs[c].ui.toggleCheck(checked);
                    delete cs[c].ui._silent;
            	} 
            }
        },                            
        layerStore: store,
        loader: tmpLoader
    });
    return layerContainerGruppe;
} 

function addKartbildeAbstractOrRemove(node, checked) { 
    if ( checked == true) {
    	var languageChoosen = getLanguage();
        jQuery.ajax({
            type: 'get',
            url: "spring/infoKartBilde",
            contentType: "application/json",
            data: {
                kartbildeNavn: node.attributes.text,
                language: languageChoosen
            },
            success:function(data) {
            	var legendDiv = getKartlagBildeDiv(node.attributes.text)
            	visKartlagInfoHTML( legendDiv, data );
            }
        }); 
    } else if ( checked == false ) {
    	var legendDiv = getKartlagBildeDiv(node.attributes.text)
    	fjernKartlagInfo(legendDiv);
    }
}

function getKartlagBildeDiv(nodeText) {   
	nodeText = nodeText.toLowerCase();
	nodeText = nodeText.replace(/�/g,'ae'); // /g global option
	nodeText = nodeText.replace(/�/g,'oe');
	nodeText = nodeText.replace(/�/g,'aa');
	nodeText = nodeText.replace(/ /g,'');

    nodeText = nodeText.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
	return nodeText;
}

function getLanguage() {
	var languageChoosen = "en";
	if (document.location.href.indexOf("mareano.html") != -1) {
		languageChoosen = "norsk";
	}
	return languageChoosen;
}

function displayLegendGraphicsAndSpesialpunkt(extent, kartlagId, layer, event, app) {
	var languageChoosen = getLanguage();
    jQuery.ajax({
        type: 'get',
        url: "spring/legendAndSpesialpunkt",
        contentType: "application/json",
        data: {
            kartlagId: kartlagId,
            language: languageChoosen,
            extent: extent
        },
        success:function(data) {
        	addLegendGraphics(kartlagId, data);
        	addSpesialpunkt(extent, kartlagId, layer, event, app, data);
        }
    }); 
}

function displayLegendGraphics(kartlagId) {
	var languageChoosen = getLanguage();
    jQuery.ajax({
        type: 'get',
        url: "spring/legend",
        contentType: "application/json",
        data: {
            kartlagId: kartlagId,
            language: languageChoosen
        },
        success:function(data) {
        	addLegendGraphics(kartlagId, data);
        }
    }); 
}

function addLegendGraphics(kartlagId, data) {
    var currentLegend;
    jQuery('#newLegend').children().each(function(index, value){
        jQuery(value).children().each(function(index, value){
            currentLegend = jQuery(value).html();
        });	        
    });
    buildLegendGraphicsHTML( currentLegend, kartlagId, data );
    visKartlagInfoHTML( kartlagId, data ); 
}

var controlSelectFeature = null;
function addSpesialpunkt(extent, kartlagId, layer, event, app, data) {
	if ( data.noSpesialpunkt == false ) { 
		var styleMap = new OpenLayers.StyleMap({
			'default':{
				externalGraphic: "theme/imr/images/geofotoSpesialpunkt.png",
				cursor: "pointer"
			}
		});
		
        var snitt = new OpenLayers.Layer.Vector("GML", { 
        	displayInLayerSwitcher: false,
            protocol: new OpenLayers.Protocol.HTTP({ 
                url: "spring/getgml", 
                format: new OpenLayers.Format.GML()
            }), 
            strategies: [new OpenLayers.Strategy.Fixed()], 
            visibility: true,                                         
            projection: new OpenLayers.Projection("EPSG:32633"),
            styleMap: styleMap
        }); 
		
		snitt.events.register( "featureselected", snitt, GMLselected );
		app.mapOfGMLspesialpunkt[kartlagId] = snitt;	    
		app.mapPanel.map.addLayer( snitt );   	           
		
		if ( controlSelectFeature == null ) {
			controlSelectFeature = new OpenLayers.Control.SelectFeature( snitt );
			defineSelectFeatureAddLayer();
			
			// add openlayers pull request: https://github.com/openlayers/openlayers/issues/958
			defineRemoveLayer();
			defineDestroy();
			defineSetMap();
			defineResetRoot();
		} else {
			controlSelectFeature.addLayer( snitt );
		}
		
		app.mapPanel.map.addControl( controlSelectFeature );
		controlSelectFeature.activate(); 	 
	}
}

function buildLegendGraphicsHTML( currentLegend, kartlagId, data ) {
    var legendGraphicsHTML = currentLegend+'<div id="'+kartlagId+'">';
    for ( var i=0; i < data.legends.length; i++ ) {
    	if ( i > 0 ) {
    		legendGraphicsHTML += '<div>';     
    	}
    	if ( data.legends[i].url != '') {
    		legendGraphicsHTML += '<table><tr><td><img src="' + data.legends[i].url + '"/></td>';
    		legendGraphicsHTML += '<td>' + data.legends[i].text + '</td></tr></table>';
    	} else {
    		legendGraphicsHTML += data.legends[i].text;
    	}
    	
    	if ( i > 0 ) {
    		legendGraphicsHTML += '</div>';     
    	}
    } 
    legendGraphicsHTML += '</div>';
    Ext.getCmp('newLegend').update(legendGraphicsHTML);
}

/**
 * bug: I have a panel in a tab that is not shown. 
 * I call update(somehtml) on that panel. The panel's html body is not updated. 
 * After I show the panel for the first time, all future updates() behave correctly whether it is hidden or shown
 * http://www.sencha.com/forum/archive/index.php/t-103797.html
 **/
function visKartlagInfoHTML(kartlagId, data) {
    var infoHTML = '<div id="'+kartlagId+'tips" style="margin-bottom: 0.1cm;"><font style="font-size: 12px;"><b>'+ 
    	data.kartlagInfo.kartlagInfoTitel+'</b>' + ':<br />' + 
    	data.kartlagInfo.text + '</font></div>';

    kartlagInfoState += infoHTML;
    updateOrSetKartlagInfo(kartlagInfoState);
}

/**
 * Remove Legend div tag and KartlagInfo div tag associated with kartlagId
 */
function removeLayerLegendAndInfo(mapOfGMLspesialpunkt, kartlagId, record, layer, app) {
	
	app.mapPanel.layers.each(function(record) {
		if (record.getLayer().metadata['kartlagId'] === kartlagId) {
			this.remove(record);
			return false;
		}
	}, app.mapPanel.layers);
	
	if ( mapOfGMLspesialpunkt[kartlagId] != null ) { //fjern spesialpunkt     
    	app.mapPanel.map.removeLayer(mapOfGMLspesialpunkt[kartlagId], false);
    	mapOfGMLspesialpunkt[kartlagId] = null;
    }
	
    var legendDiv = '#'+kartlagId; //fjern legend
    jQuery(legendDiv).remove();
	
    fjernKartlagInfo(kartlagId);
}

function fjernKartlagInfo(legendDiv) {
	var temp = jQuery("<div>").html(kartlagInfoState); 
    
    legendDiv = getKartlagBildeDiv(legendDiv);
    jQuery(temp).find('#'+legendDiv+'tips').remove();
    
    kartlagInfoState = jQuery(temp).html();
    updateOrSetKartlagInfo(kartlagInfoState);
}

function updateOrSetKartlagInfo(kartlagInfoState) {
    if ( Ext.getCmp('tips').rendered ) {
    	Ext.getCmp('tips').update(kartlagInfoState);
    } else {
    	Ext.getCmp('tips').html = kartlagInfoState;
    }	
}

/**
 * Show popup box with spesialpunkt
 */
function GMLselected (event) {
    if ( event.feature.data.type == "bilder" ) {
    	Ext.MessageBox.show({
    		title:event.feature.data.name, 
    		msg:'<a href="' + event.feature.data.description + '" TARGET="_blank"><img src=" '+event.feature.data.description+'" width=150 height=100 /></a>'
    	});
    } else if ( event.feature.data.type == "video" ) {
        Ext.MessageBox.show({
        	title:event.feature.data.name, 
        	msg:'<embed width="330" height="200" controls="TRUE" autoplay="TRUE" loop="FALSE" src="'+event.feature.data.description+'">'
        });
    } else if ( event.feature.data.type == "pdf" ) { // finnes ennaa ikke
        Ext.MessageBox.show({title:event.feature.data.name,msg:'<a href="' + event.feature.data.description + '" TARGET="_blank">' + event.feature.data.name + '</a>'});    
    } else if ( event.feature.data.type == "text" ) {
        jQuery.get('/geodata/proxy?url=http://atlas.nodc.no/website/mareano/' + event.feature.data.description, function(response) { 
            Ext.MessageBox.show({title:event.feature.data.name, msg: response}); 
		});
    }
}


