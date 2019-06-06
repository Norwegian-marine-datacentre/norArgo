
var app;

var ProfileWindow = new Ext.Window({
    title: "Profiles",
    width: 700,
    height: 450,
    x:10,
    y:10,
    closeAction:'hide',
    activeProfile:0,
    layout: "border",
    bbar: [
        {
            id: 'profile-prev',
            text: 'Back',
	    win:this,
	    handler: function () {
		this.findParentByType("window").profileNav(-1);
	    },
            disabled: true
        },
        '->', // greedy spacer so that the buttons are aligned to each side
        {
            id: 'profile-next',
            text: 'Next',
	    wint:this,
	    handler: function () {
		this.findParentByType("window").profileNav(1);
	    }
        }
    ],
    items: [
	new Ext.Panel ({
	    region: 'west',
            layout: {
		type: 'vbox'
            },
            width: 200,
            items: []}),
	new Ext.TabPanel({
	    id:"chartTabs",
	    region: 'center',
            deferredRender: false,
            xactiveTab: 0,
            flex: 1
	})],
    data:[],
    listeners: {
        resize: function () {
        },
        close: function () {
        },
	hide: function () {
	    this.labelLayer.removeAllFeatures();
	    this.labelLayer = null;
        }
	
    },
    initPlatformDisplay: function(platformData,mapClickPos)
    {
	this.data = platformData.measurements;

	//Add profile info
	this.addPlatformDetails(platformData.platform);

	this.doLayout();
        this.show();
	
	//Set closest profile to active
	this.setActiveProfile(this.findClosestProfile(mapClickPos));
    },
    addPlatformDetails: function(platform) {
	var detailPanel =this.getComponent(0);
	detailPanel.removeAll();
	
	detailPanel.add(this.createDetailLine("Program", platform.program));
	
        detailPanel.add(this.createDetailLine("Country", platform.country));
        detailPanel.add(this.createDetailLine("WMO Code", platform.wmocode));
        detailPanel.add(this.createDetailLine("Model", platform.model));
        detailPanel.add(this.createDetailLine("Deployed", platform.startDate));
	detailPanel.add(this.createDetailLine("Total profiles", platform.profileCount.toString()));
	detailPanel.add(this.createDetailLine("Profile date","","profileDate"));
	detailPanel.add(this.createDetailLine("Profile latitude","","profileLat"));
	detailPanel.add(this.createDetailLine("Profile longitude","","profileLon"));
	
        detailPanel.add({
            autoEl: 'div',
            layout: 'column',
            border: false,
            width: 180,
            defaults: {
                border: false
            },
            padding: '5px 0px 5px 10px',
            html: "<a href='" + platform.link + "'>Download NetCDF data</a>"
        });

    },
    createDetailLine: function (label, value,id) {
	var dateConfig = {
	    padding: '0px 0px 0px 5px',
            html: value
        };
	if (id)
	{
	    dateConfig.id=id;
	}
	var valueElement = new Ext.BoxComponent(dateConfig);
        return {
            autoEl: 'div',
            layout: 'column',
            border: false,
            width: 180,
            defaults: {
                border: false
            },
            padding: '5px 0px 5px 10px',
            items: [
                {
                    html: label + ':',
                    width: 50,
                    style: {
                        'font-weight': 'bold'
                    }
                },
		valueElement
            ]
        }
    },
    setActiveProfile: function(index) {
	this.activeProfile = index;
	this.getBottomToolbar().getComponent('profile-prev').setDisabled(index==0);
	this.getBottomToolbar().getComponent('profile-next').setDisabled(index==this.data.length-1);
	
	var profile = this.data[index];

	//Move position marker
	if (!this.labelLayer) {
	    this.labelLayer  = app.mapPanel.map.getLayersByName("labels")[0];
	    this.labelLayer.setZIndex(1001);
	    this.activePos =  new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(profile.longitude,profile.latitude));
            this.activePos.style = {
                externalGraphic: "image/marker.png",
                graphicWidth: 20,
                graphicHeight: 34,
		graphicYOffset: -34,
                fillOpacity: 1
            };
	    this.labelLayer.addFeatures(this.activePos);
	} else {
	this.activePos.move(new OpenLayers.LonLat(profile.longitude,profile.latitude));
	}
	//Ensure vector layer is on top
	//app.mapPanel.map.setLayerIndex(this.labelLayer,200);
	
	
	this.setTitle("Profile at "+profile.dateString);
	Ext.getCmp("profileDate").update(profile.dateString);
	Ext.getCmp("profileLat").update(profile.latitude);
	Ext.getCmp("profileLon").update(profile.longitude);

	
	var currentTabTitle;
	if (Ext.getCmp("chartTabs").getActiveTab()) {
	    currentTabTitle = Ext.getCmp("chartTabs").getActiveTab().title;
	}
	Ext.Ajax.request({
            url: 'norArgo/measurement',
            method: 'GET',
            params: {id: profile.id},
            success: function (responseObject) {
                var chartData = Ext.decode(responseObject.responseText);
		var lastTab =0;
		var tabCount = 0;
		Ext.getCmp("chartTabs").removeAll();
		var tabWidth =Ext.getCmp("chartTabs").getWidth();
                Ext.iterate(chartData, function (key, value) {
		    var tab = new Ext.Panel({
			layout: "fit",
			title: key,
			items: new Ext.Panel({html:"Loading "+key})
		    });
		    if (key == currentTabTitle) {
			lastTab = tabCount;
		    }
		    tabCount++;
		    Ext.getCmp("chartTabs").add(tab);
		    Ext.getCmp("chartTabs").doLayout(true);
		    jQuery("#"+tab.id).highcharts({
			chart: {
			    inverted: true,
			    xheight:600,
			    width: tabWidth
			},
			title: {
			    text: key
			},
			xAxis: {
			    title: {
				text: 'Depth'
			    }},
			series: [{
                            name: key,
                            data: value
			}]});
		});
		Ext.getCmp("chartTabs").setActiveTab(lastTab);
	    }});
	var tab = new Ext.Panel({
            layout: "fit",
            title: "Loading data...",
            html: "Loading data....."
        });
	Ext.getCmp("chartTabs").removeAll();
        Ext.getCmp("chartTabs").add(tab);
	Ext.getCmp("chartTabs").setActiveTab(0);
    },
    profileNav: function(direction) {
	this.setActiveProfile(this.activeProfile+direction);
    },
    findClosestProfile: function(pos) {
	var posGeom = new OpenLayers.Geometry.Point(pos.lon, pos.lat);
	var closest =0;
	var dist;
	var closestDistance = Number.MAX_VALUE;
	for (var i=0;i<this.data.length;i++) {
	    dist = posGeom.distanceTo(new OpenLayers.Geometry.Point(this.data[i].longitude,this.data[i].latitude));
	    if (dist < closestDistance) {
		closest = i;
		closestDistance = dist;
	    }
	}
	return closest;
    }
});


var ProfileDisplay = {
    map: null,
    //layout:"fit",
    dynamicPointsControl: null,
    layerIDs: {},
    controls: [],
    attachTo: function (map) {
        map.layers.on("update", this.updateInfo, this);
        map.layers.on("add", this.updateInfo, this);
        map.layers.on("remove", this.updateInfo, this);
        this.map = map;
    },
    updateInfo: function () {
        var self = this;
        var layers = this.map.layers.queryBy(function (x) {
	    return x.get("queryable") && !self.layerIDs[x.id];
        });

        layers.each(function layer(x) {
            var layer = x.getLayer();

	
            //Only interested in platform points and layers that have not already had controls created for them
            if ((layer.params.ISPROFILE) || (layer.params["VIEWPARAMS"] &&
                    layer.params["VIEWPARAMS"].indexOf("id_plat") == 0)) {
                var control = new OpenLayers.Control.WMSGetFeatureInfo({
                    url: layer.url,
                    queryVisible: true,
                    layers: [layer],
                    isProfile: true, //Hacky flag so does not display when identify is active 	
                    //infoFormat: "application/json",
                    infoFormat: "application/vnd.ogc.gml",
                    vendorParams: {"VIEWPARAMS": layer.params["VIEWPARAMS"]},
                    eventListeners: {
                        getfeatureinfo: this.showPlatform,
                        scope: this
                    }});
                self.map.map.addControl(control);
		control.activate();
                self.layerIDs[layer.id] = true;
		if (layer.name == "dynamicPoints" ) {
		    self.dynamicPointsControl = control;
		}
                self.controls.push(control);
            }
        }, this);
    },
    showPlatform: function (featureEvent) {
        var self = this;
	if (featureEvent.features.length == 0) {
	    return
	}
	
        var identify = false;
        jQuery.each(this.map.map.getControlsByClass('OpenLayers.Control.WMSGetFeatureInfo'), function (i, control) {
            if ((control.active) && (!control.isProfile)) {
                identify = true;
                return;
            }
        });
        if (identify) {
            return
        }

	if (app.lastProfile)
	{
	    if ((Date.now()-app.lastProfile)/1000 < 2)
	    {
		return;
	    }
	}

        app.lastProfile = Date.now();
	//Only use first platform  found
	var platformID = featureEvent.features[0].attributes.id_platform;
	var featureID = featureEvent.features[0].attributes.id;

	var mapClickPos = app.mapPanel.map.getLonLatFromPixel(featureEvent.xy);
	
        Ext.Ajax.request({
            url: 'norArgo/platform/metaData',
            method: 'GET',
            params: {id: platformID},
            success: function (responseObject) {
                var platformData = Ext.decode(responseObject.responseText);
		ProfileWindow.initPlatformDisplay(platformData,mapClickPos);
	    }});
    }
};


Ext.onReady(function () {

    OpenLayers.ImgPath = "theme/app/img/";
    GeoExt.Lang.set('en');
    app = new NorArgo.Composer({
        // proxy: "proxy/?url=",
        proxy: "Proxy?url=",
        printService: null,
        //   about: {
        //       title: "NorArgo",
        //       "abstract": "Copyright (C) 2005-2016 Mareano. Map projection WGS84, UTM 33 N",
        //       contact: "For more information, contact <a href='http://www.imr.no'>Institute of Marine Research</a>."
        //   },
        defaultSourceType: "gxp_wmscsource",
        sources: {
            ol: {
                ptype: "gx_olsource"
            }
        },
        map: {
            projection: "EPSG:4326",
            units: "degrees",
            layers: [
		{
                    source: "ol",
                    type: "OpenLayers.Layer.WMS",
                    group: "background",
                    args: [
                        "Gebco",
                        "http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?",
                        {layers: "gebco_latest", format: "image/png", transparent: false, isBaseLayer: true}
                    ]
		},
		{
		    source: "ol",
                    type: "OpenLayers.Layer.Vector",
		    args: ["labels"]
		}

            ],
            center: [0.0, 65.0],
            zoom: 5
        }
    });


    function createLayerRecord(name, layerName, isProfile, visible)
    {
        return app.layerSources.ol.createLayerRecord({
            type: 'OpenLayers.Layer.WMS',
            queryable: true,
            args: [
                name,
                geoserverURL,
                {
                    LAYERS: layerName,
                    TRANSPARENT: 'TRUE',
                    isProfile: isProfile
                },
                {
                    displayInLayerSwitcher: false,
                    isBaseLayer: false
                }
            ],
            visibility: visible
        });
    }



    var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";
    var layers = [];

    var maxPeriod = 365;
    var defaultStartDay  = 60;
    var defaultEndDay  = 0;
    
    
    app.on("ready", function () {

        //Inject custom actions
        ProfileDisplay.attachTo(app.mapPanel);

        //Remove some tools
        var toolbar = Ext.getCmp('paneltbar');
        toolbar.remove("aboutbutton");
        toolbar.remove("mapmenu");
        toolbar.remove("loginbutton");

	//Setup dynamic layer
        
       //var dynamicPeriodPath = createLayerRecord("dynamicPeriodPath", "norargo_period_path_dev", true, false) ;
       var dynamicPeriodPath = createLayerRecord("dynamicPeriodPath", dynamicRangePathLayer, true, false);
       dynamicPeriodPath.getLayer().params.VIEWPARAMS = "startDay:" +defaultStartDay+";endDay:" +defaultEndDay;

//        var dynamicPeriodPoints = createLayerRecord("dynamicPoints", "norargo_period_pos_dev", true, false);
        var dynamicPeriodPoints = createLayerRecord("dynamicPoints", dynamicRangePointLayer, true, false);
        dynamicPeriodPoints.getLayer().params.VIEWPARAMS = "startDay:" +defaultStartDay+";endDay:" +defaultEndDay;

	
	var dynamicPeriodNode;

	var defaultStartDate =new Date((new Date()) - 1000 * 60 * 60 * 24 * defaultStartDay);
	var defaultLabel = defaultStartDate.format("d/m/y")+"-"+(new Date().format("d/m/y"))+"(60 days)";
	var dynamicPeriod = {nodeType: "gx_layer",
			     "leaf": true,
			     "text":"Floats: "+defaultLabel,
			     "layer": dynamicPeriodPath.getLayer(),
			     "id": "dyna"}
	
	//Match visibility of points and path
	dynamicPeriodPath.getLayer().events.on({"visibilitychanged":function (e) {
	    dynamicPeriodPoints.getLayer().setVisibility(dynamicPeriodPath.getLayer().getVisibility());
	}}); 
	

	//Add custom tools
	toolbar.add(  {xtype: 'tbtext', text: 'Adjust period'});
	var sliderText = new Ext.Toolbar.TextItem({text: defaultLabel,id:"sliderText"}); 
	
	toolbar.add( new Ext.slider.MultiSlider({
	    width: 250,
	    minValue: 0,
	    maxValue: maxPeriod,
	    label:sliderText,
	    values: [maxPeriod-defaultStartDay,maxPeriod-defaultEndDay],
	    calcDaysAgo: function(v) {
		//return Math.round(maxPeriod-maxPeriod*v/100);
		return Math.round(maxPeriod-v);
	    },
	    toString: function() {
		var startDays = this.calcDaysAgo(this.thumbs[0].value);
		var endDays  = this.calcDaysAgo(this.thumbs[1].value);
		var now = new Date();
		var startDate =new Date(now - 1000 * 60 * 60 * 24 * startDays);
		var endDate = new Date(now - 1000 * 60 * 60 * 24 * endDays);
		return startDate.format("d/m/y")+"-"+endDate.format("d/m/y")+" ("+(-1*(endDays-startDays))+" days)";
	    },
	    listeners: {
		change: function( slider, newValue, thumb )
		{
		   
		},
		changecomplete: function( slider, newValue, thumb )
		{
		    var startDays = this.calcDaysAgo(this.thumbs[0].value);
		    var endDays  = this.calcDaysAgo(this.thumbs[1].value);
		    var layerParams = "startDay:"+startDays+";endDay:" +endDays;
		    
		    dynamicPeriodPath.getLayer().params.VIEWPARAMS = layerParams;
		    dynamicPeriodPath.getLayer().redraw();
		    dynamicPeriodPoints.getLayer().params.VIEWPARAMS = layerParams;
		    dynamicPeriodPoints.getLayer().redraw();
		    var labelString  = this.toString(); 
		    dynamicPeriodNode.setText("Floats: "+labelString);
		    this.label.setText(labelString);
		    ProfileDisplay.dynamicPointsControl.vendorParams= {"VIEWPARAMS": layerParams};
		}

	    },
	    plugins: new Ext.slider.Tip({
		getText: function(thumb){
		    var daysAgo =thumb.slider.calcDaysAgo(thumb.value);
		    return (daysAgo > 0 )?String.format('{0} days ago', daysAgo):"Today";
		}
	    })
	}));
	toolbar.add(sliderText);
	
        var treeRoot = Ext.getCmp('layers').getRootNode();
        var floatsTree = new Ext.tree.TreeNode({
            text: 'NorArgo',
            expanded: true});
        treeRoot.replaceChild(floatsTree, treeRoot.childNodes[0]);

        var layer;
        var node;

        var defaultDaysLayer = createLayerRecord("Siste 60 dager path", tailLayer, true, true);
        app.mapPanel.layers.add(defaultDaysLayer);
        //node = {nodeType: "gx_layer", "leaf": true, "text": "Siste 60 dager", "layer": defaultDaysLayer.getLayer(), "id": "sist60"}
	node = {nodeType: "gx_layer", "leaf": true, "text": "Last 60 days", "layer": defaultDaysLayer.getLayer(), "id": "sist60"}
        floatsTree.appendChild(node);

        //layer = createLayerRecord("Alle floats", headLayer, true, true);
	layer = createLayerRecord("Active floats (Last position)", headLayer, true, true);
        app.mapPanel.layers.add(layer);
        node = {nodeType: "gx_layer", "leaf": true, "text": "Active floats (Last position)", "layer": layer.getLayer(), "id": "sist60_point"}
        floatsTree.appendChild(node);

        app.mapPanel.layers.add(dynamicPeriodPath);
	app.mapPanel.layers.add(dynamicPeriodPoints);
        dynamicPeriodNode  = floatsTree.appendChild(dynamicPeriod);
	
      

   

        var flTree = new Ext.tree.TreeNode({"expandable": true, "text": "Floats", "id": "floatList"});
        for (var i = 0; i < floatList.length; i++) {
            flTree.appendChild(new Ext.tree.TreeNode({"expandable": true, "text": floatList[i].wmo_platform_code + ' - ' + floatList[i].country, platform_id: floatList[i].id, listeners: {
                    expand: function (node, deep, anim) {
                        if (!node.firstChild) {
                         
                          var  layerRecord = createLayerRecord("Linjer", pathLayer, false, false);
                            layerRecord.getLayer().params.VIEWPARAMS = "id:" + node.attributes.platform_id;
                            //app.mapPanel.layers.insert(0, layerRecord);
                            app.mapPanel.layers.add(layerRecord);

                            node.appendChild({nodeType: "gx_layer", "leaf": true, "text": "Linjer", "layer": layerRecord.getLayer()});
                            
                             layerRecord = createLayerRecord("Punkter", positionLayer, true, false);
                            layerRecord.getLayer().params.VIEWPARAMS = "id_platform:" + node.attributes.platform_id;
                            //app.mapPanel.layers.insert(0, layerRecord);
                            app.mapPanel.layers.add(layerRecord);
                            node.appendChild({nodeType: "gx_layer", "leaf": true, "text": "Punkter", "layer": layerRecord.getLayer()});

                        }
                    }}}));
        }



        var floatsCountryTree = new Ext.tree.TreeNode({"expandable": true, "text": "Floats by country", "id": "floatCountryList"});
        jQuery.each(floatsByCountry, function (country, countryFloats) {
            var floats = new Ext.tree.TreeNode({"expandable": true, "text": country.charAt(0) + country.slice(1).toLowerCase(), "id": country + "List"});
            for (var i = 0; i < countryFloats.length; i++) {
                floats.appendChild(new Ext.tree.TreeNode({"expandable": true, "text": countryFloats[i].wmo_platform_code, platform_id: countryFloats[i].id, listeners: {
                        expand: function (node, deep, anim) {
                            if (!node.firstChild) {
                               
                                var layerRecord = createLayerRecord("Linjer", pathLayer, false, false);
                                layerRecord.getLayer().params.VIEWPARAMS = "id:" + node.attributes.platform_id;
                                //app.mapPanel.layers.insert(0, layerRecord);
                                app.mapPanel.layers.add(layerRecord);
				
                                node.appendChild({nodeType: "gx_layer", "leaf": true, "text": "Linjer", "layer": layerRecord.getLayer()});

				layerRecord = createLayerRecord("Punkter", positionLayer, true, false);
                                layerRecord.getLayer().params.VIEWPARAMS = "id_platform:" + node.attributes.platform_id;
                                                             app.mapPanel.layers.add(layerRecord);
				node.appendChild({nodeType: "gx_layer", "leaf": true, "text": "Punkter", "layer": layerRecord.getLayer()});
                                
                            }
                        }
                    }}));
            }
            floatsCountryTree.appendChild(floats);
        });

        floatsTree.appendChild(floatsCountryTree);
        floatsTree.appendChild(flTree);
	app.profileLoading = false;

    });
});


