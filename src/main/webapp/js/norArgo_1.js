var app;

var ProfileDisplay = {
    //title:"Profiles",
    //width: 600,
    //height: 450, 
    map: null,
    //layout:"fit",
    win: null,
    cardPanel: null,
    activeCard: 0,
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


            //Only interested in platform points
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
                        getfeatureinfo: this.showGraphs,
                        scope: this
                    }});
                self.map.map.addControl(control);

                control.activate();
                self.layerIDs[layer.id] = true;
                self.controls.push(control);
            }
        }, this);
        console.log("Update info for window with ", self.controls.length);
    },
    addCard: function (card) {
        if (!this.cardPanel) {
            console.log("create card panel");
            var navHandler = function (direction) {
                if (this.cardPanel.getComponent(this.activeCard + direction)) {
                    this.activeCard = this.activeCard + direction;
                    this.cardPanel.getLayout().setActiveItem(this.activeCard);
                    this.cardPanel.doLayout();
                    this.addCharts(this.cardPanel.getComponent(this.activeCard).getComponent(1));
                    this.cardPanel.getBottomToolbar().getComponent('move-prev').setDisabled(this.activeCard == 0);
                    this.cardPanel.getBottomToolbar().getComponent('move-next').setDisabled(!this.cardPanel.getComponent(this.activeCard + 1));
                }
            };
            this.cardPanel = new Ext.Panel({
                layout: 'card',
                activeItem: 0,
                defaults: {
                    border: false
                },
                bbar: [
                    {
                        id: 'move-prev',
                        text: 'Back',
                        handler: navHandler.createDelegate(this, [-1]),
                        disabled: true
                    },
                    '->', // greedy spacer so that the buttons are aligned to each side
                    {
                        id: 'move-next',
                        text: 'Next',
                        handler: navHandler.createDelegate(this, [1])
                    }
                ],
                // the panels (or "cards") within the layout
                items: []

            });
            this.win.add(this.cardPanel);
            //this.doLayout();
        }
        this.cardPanel.add(card);
        //this.cardPanel.doLayout();
    },
    createDetailLine: function (label, value) {
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
                {
                    padding: '0px 0px 0px 5px',
                    html: value
                }
            ]
        }
    },
    addProfileDetails: function (platform, feature, panel) {
        panel.items.push(this.createDetailLine("Program", platform.program));
        panel.items.push(this.createDetailLine("Country", platform.country));
        panel.items.push(this.createDetailLine("WMO Code", platform.wmocode));
        panel.items.push(this.createDetailLine("Model", platform.model));
        panel.items.push(this.createDetailLine("Deployed", platform.startDate));
        panel.items.push(this.createDetailLine("Total profiles", platform.profileCount.toString()));
        panel.items.push(this.createDetailLine("Profile date", feature.date));
        
        panel.items.push({
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
    setupProfileCharts: function (feature, panel, first) {
        var self = this;
        console.log(feature);
        
        Ext.Ajax.request({
            url: 'norArgo/platformMeaurement',
            method: 'GET',
            params: {id: feature.id_platform, date: feature.date,latitude:feature.latitude,longitude:feature.longitude},
            success: function (responseObject) {
                var chartData = Ext.decode(responseObject.responseText);
                Ext.iterate(chartData, function (key, value) {
                    var chartPanel = new Ext.Panel({
                        html: "loading chart..."
                    });

                    var tab = new Ext.Panel({
                        layout: "fit",
                        targ: chartPanel,
                        chartData: {name: key,
                            data: value},
                        title: key,
                        items: chartPanel
                    });
                    panel.add(tab);
                });

                panel.setActiveTab(0);
                if (first) {
                    self.win.doLayout();
                    self.win.show();
                    self.addCharts(panel);
                    self.cardPanel.getBottomToolbar().getComponent('move-next').setDisabled(!self.cardPanel.getComponent(self.activeCard + 1));
                }

            }});
    },
    removeCharts: function (tabPanel) {
        //TODO clean up charts
    },
    addCharts: function (tabPanel) {
        tabPanel.items.each(function (tab) {
            tab.doLayout(true);
            jQuery("#" + tab.id).highcharts({
                chart: {
                    inverted: true,
                    height: tab.container.getHeight(),
                    width: tab.container.getWidth()
                },
                title: {
                    text: tab.title
                },
                xAxis: {
                    title: {
                        text: 'Depth'
                    }},
                series: [{
                        name: tab.title,
                        data: tab.chartData.data
                    }]});
        });
    },
    showGraphs: function (featureEvent) {
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
        }        ;

        if (!this.win) {
            this.win = new Ext.Window({
                title: "Profiles",
                width: 700,
                height: 450,
                layout: "fit",
                listeners: {
                    resize: function () {
                    },
                    close: function () {
                        self.cardPanel = null;
                        self.win = null;
                    }}
            });
        }

        Ext.Ajax.request({
            url: 'norArgo/platformMeaurement/metaData',
            method: 'GET',
            params: {id: featureEvent.features[0].attributes.id_platform},
            success: function (responseObject) {
                var platformData = Ext.decode(responseObject.responseText);
                var features = featureEvent.features;
                for (var i = 0; i < features.length; i++) {
                    var newCard = {
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'},
                        items: [{
                                xtype: 'container',
                                layout: {
                                    type: 'vbox',
                                },
                                width: 200,
                                items: []
                            }, new Ext.TabPanel({
                                deferredRender: false,
                                activeTab: 0,
                                flex: 1
                            })
                        ]};

                    self.addProfileDetails(platformData, features[i].attributes, newCard.items[0]);
                    self.setupProfileCharts(features[i].attributes, newCard.items[1], (i == 0));
                    self.addCard(newCard);
                }
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
            layers: [{
                    source: "ol",
                    type: "OpenLayers.Layer.WMS",
                    group: "background",
                    args: [
                        "Gebco",
                        "http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?",
                        {layers: "gebco_latest", format: "image/png", transparent: false, isBaseLayer: true}
                    ]
                }
            ],
            center: [-12.392578125, 52.5361328125],
            zoom: 4
        }
    });


    function createLayerRecord(name, layerName, isProfile, visible)
    {
        return app.layerSources.ol.createLayerRecord({
            type: 'OpenLayers.Layer.WMS',
            queryable: true,
            args: [
                name,
                MAPS_IMR_NO,
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
	var dynamicPeriodPath = createLayerRecord("dynamicPeriodPath", "norargo_period_path_dev", false, true);
        dynamicPeriodPath.getLayer().params.VIEWPARAMS = "startDay:" +defaultStartDay+";endDay:" +defaultEndDay;

	var dynamicPeriodPoints = createLayerRecord("dynamicPoints", "norargo_period_pos_dev", false, true);
        dynamicPeriodPoints.getLayer().params.VIEWPARAMS = "startDay:" +defaultStartDay+";endDay:" +defaultEndDay;

	
	var dynamicPeriodNode;

	var defaultStartDate =new Date((new Date()) - 1000 * 60 * 60 * 24 * defaultStartDay);
	var dynamicPeriod = {nodeType: "gx_layer",
			     "leaf": true,
			     "text":"Floats: "+defaultStartDate.format("d/m/y")+"-"+(new Date().format("d/m/y")),
			     "layer": dynamicPeriodPath.getLayer(),
			     "id": "dyna"}
	
	

	//Add custom tools
	toolbar.add(  {xtype: 'tbtext', text: 'Adjust period'}); 
	toolbar.add( new Ext.slider.MultiSlider({
	    width: 250,
	    minValue: 0,
	    maxValue: maxPeriod,
	    values: [maxPeriod-defaultStartDay,maxPeriod-defaultEndDay],
	    calcDaysAgo: function(v) {
		//return Math.round(maxPeriod-maxPeriod*v/100);
		return Math.round(maxPeriod-v);
	    },
	    listeners: {
		change: function( slider, newValue, thumb )
		{
		    console.log("chnage ");
		},
		changecomplete: function( slider, newValue, thumb )
		{
		    var startDays = this.calcDaysAgo(this.thumbs[0].value);
		    var endDays  = this.calcDaysAgo(this.thumbs[1].value);
		    var now = new Date();
		    var startDate =new Date(now - 1000 * 60 * 60 * 24 * startDays);
		    var endDate = new Date(now - 1000 * 60 * 60 * 24 * endDays);
		    
		    
		    
		    
		    dynamicPeriodPath.getLayer().params.VIEWPARAMS = "startDay:"+startDays+";endDay:" +endDays;
		    dynamicPeriodPath.getLayer().redraw();
		    dynamicPeriodPoints.getLayer().params.VIEWPARAMS = "startDay:"+startDays+";endDay:" +endDays;
		    dynamicPeriodPoints.getLayer().redraw();
		    dynamicPeriodNode.setText("Floats: "+startDate.format("d/m/y")+"-"+endDate.format("d/m/y"));
		}

	    },
	    plugins: new Ext.slider.Tip({
		getText: function(thumb){
		    var daysAgo =thumb.slider.calcDaysAgo(thumb.value);
		    return (daysAgo > 0 )?String.format('{0} days ago', daysAgo):"Today";
		}
	    })
	}));
	
        var treeRoot = Ext.getCmp('layers').getRootNode();
        var floatsTree = new Ext.tree.TreeNode({
            text: 'NorArgo',
            expanded: true});
        treeRoot.replaceChild(floatsTree, treeRoot.childNodes[0]);

        var layer;
        var node;

        layer = createLayerRecord("Alle floats", headLayer, true, true);
        app.mapPanel.layers.add(layer);
        node = {nodeType: "gx_layer", "leaf": true, "text": "Alle floats", "layer": layer.getLayer(), "id": "sist60_point"}
        floatsTree.appendChild(node);



        app.mapPanel.layers.add(dynamicPeriodPath);
	app.mapPanel.layers.add(dynamicPeriodPoints);
        dynamicPeriodNode  = floatsTree.appendChild(dynamicPeriod);
	
        var defaultDaysLayer = createLayerRecord("Siste 60 dager path", tailLayer, true, true);
        app.mapPanel.layers.add(defaultDaysLayer);
        node = {nodeType: "gx_layer", "leaf": true, "text": "Siste 60 dager", "layer": defaultDaysLayer.getLayer(), "id": "sist60"}
        floatsTree.appendChild(node);

        floatsTree.appendChild(new Ext.tree.TreeNode({"expandable": true, "text": "Custom period path", listeners: {
                click: function (node, e) {
                    Ext.Msg.prompt('Custom period', 'Please enter days :', function (btn, text) {
                        if (btn == 'ok') {
                            if (/^([0-9]+)$/.test(text)) {
                                layerRecord = createLayerRecord("custom" + text, "norargo_days_path_dev", false, true);
                                layerRecord.getLayer().params.VIEWPARAMS = "days:" + text
                                app.mapPanel.layers.add(layerRecord);
                                defaultDaysLayer.getLayer().visibility = false;
                                newNode = {nodeType: "gx_layer", "leaf": true, "text": "Siste " + text + " dager", "layer": layerRecord.getLayer(), "idx": "sist" + text}
                                node.appendChild(newNode);
                                node.expand();
                            } else {
                                Ext.Msg.alert('', 'Invalid number of days');
                            }
                        }
                    });
                }
            }}));

        var flTree = new Ext.tree.TreeNode({"expandable": true, "text": "Floats", "id": "floatList"});
        for (var i = 0; i < floatList.length; i++) {
            flTree.appendChild(new Ext.tree.TreeNode({"expandable": true, "text": floatList[i].wmo_platform_code + ' - ' + floatList[i].country, platform_id: floatList[i].id, listeners: {
                    expand: function (node, deep, anim) {
                        if (!node.firstChild) {
                            var layerRecord = createLayerRecord("Punkter", positionLayer, true, false);
                            layerRecord.getLayer().params.VIEWPARAMS = "id_platform:" + node.attributes.platform_id;
                            //app.mapPanel.layers.insert(0, layerRecord);
                            app.mapPanel.layers.add(layerRecord);
                            node.appendChild({nodeType: "gx_layer", "leaf": true, "text": "Punkter", "layer": layerRecord.getLayer()});

                            layerRecord = createLayerRecord("Linjer", pathLayer, false, false);
                            layerRecord.getLayer().params.VIEWPARAMS = "id:" + node.attributes.platform_id;
                            //app.mapPanel.layers.insert(0, layerRecord);
                            app.mapPanel.layers.add(layerRecord);

                            node.appendChild({nodeType: "gx_layer", "leaf": true, "text": "Linjer", "layer": layerRecord.getLayer()});
                            console.log("map ", app.mapPanel.map.getCenter(), app.mapPanel.map.getZoom());
                            console.log("mapb", app.mapPanel);
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
                                var layerRecord = createLayerRecord("Punkter", positionLayer, true, false);
                                layerRecord.getLayer().params.VIEWPARAMS = "id_platform:" + node.attributes.platform_id;
                                //app.mapPanel.layers.insert(0, layerRecord);
                                app.mapPanel.layers.add(layerRecord);
                                node.appendChild({nodeType: "gx_layer", "leaf": true, "text": "Punkter", "layer": layerRecord.getLayer()});

                                layerRecord = createLayerRecord("Linjer", pathLayer, false, false);
                                layerRecord.getLayer().params.VIEWPARAMS = "id:" + node.attributes.platform_id;
                                //app.mapPanel.layers.insert(0, layerRecord);
                                app.mapPanel.layers.add(layerRecord);

                                node.appendChild({nodeType: "gx_layer", "leaf": true, "text": "Linjer", "layer": layerRecord.getLayer()});
                                console.log("mapb", app.mapPanel);
                            }
                        }
                    }}));
            }
            floatsCountryTree.appendChild(floats);
        });

        floatsTree.appendChild(floatsCountryTree);
        floatsTree.appendChild(flTree);


    });
});




