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

        console.log("map ", this.map.map.center, this.map.map.resolution);

        layers.each(function layer(x) {
            var layer = x.getLayer();
//	    console.log("a",layer,layer.params.ISPROFILE);


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
    createDetailLine: function(label,value) {
	return {
	    autoEl: 'div',
	    layout:'column',
	    border: false,
	    width:180,
	    defaults: {
		border: false
	    },
	    padding:'5px 0px 5px 10px',
            items: [
		{
		    html: label+':',
		    width:50,
		    style: {
			'font-weight': 'bold'
                     }
		},
                {
		    padding:'0px 0px 0px 5px',
		    html: value
		}
            ]
	}
    },
    addProfileDetails: function (platform, feature, panel) {
        panel.items.push(this.createDetailLine("Program",platform.program));
	panel.items.push(this.createDetailLine("Country",platform.country));
	panel.items.push(this.createDetailLine("WMO Code",platform.wmocode));
	panel.items.push(this.createDetailLine("Model",platform.model));
	panel.items.push(this.createDetailLine("Deployed",platform.startDate));
	panel.items.push(this.createDetailLine("Total profiles",platform.profileCount.toString()));
	panel.items.push(this.createDetailLine("Download data","<a href='"+platform.link+"'>Profile date</a>"));
	panel.items.push(this.createDetailLine("Profile date",feature.date));
    }, 
    setupProfileCharts: function (feature, panel, first) {
        var self = this;
        Ext.Ajax.request({
            url: 'spring/norArgo/platformMeaurement',
            method: 'GET',
            params: {id: feature.id_platform, date: feature.date},
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

        console.log(featureEvent.features);
	console.log("Got:"+featureEvent.features.length);
	

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
        ;

        if (!this.win) {
            this.win = new Ext.Window({
                title: "Profiles",
                width: 700,
                height: 450,
                layout: "fit",
                listeners: {
                    resize: function () {
                        console.log("Resize", self.cardPanel);
                    },
                    close: function () {
                        self.cardPanel = null;
                        self.win = null;
                        console.log("Close");
                    }}
            });
        }


        Ext.Ajax.request({
            url: 'spring/norArgo/platformMeaurement/metaData',
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
				type:'vbox',
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
    
    
    console.log("Using layer:"+headLayer);
    
    OpenLayers.ImgPath = "theme/app/img/";
    GeoExt.Lang.set('en');
    app = new NorArgo.Composer({
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
            maxResolution: 14479.0,
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
            center: [-1514367.8917845, -2035476.4551685],
            //center: [-517363.6417845,-2106729.6426685],
            zoom: 1
        }
    });

    function createProfileLayer(name, layerName, visible) {
        var result = app.layerSources.ol.createLayerRecord({
            type: 'OpenLayers.Layer.WMS',
            queryable: true,
            args: [
                name,
                MAPS_IMR_NO,
                {
                    LAYERS: layerName,
                    TRANSPARENT: 'TRUE',
                    viewparams: "",
                    isProfile: true
                },
                {
                    displayInLayerSwitcher: false,
                    isBaseLayer: false
                }
            ],
            visibility: visible
        });
        app.mapPanel.layers.insert(0, [result]);
        return result;
    }


    var MAPS_IMR_NO = "http://maps.imr.no/geoserver/wms?";
    var layers = [];

    app.on("ready", function () {

        //Inject custom actions
        ProfileDisplay.attachTo(app.mapPanel);
        
        var treeRoot = Ext.getCmp('layers').getRootNode();
        var floatsTree = new Ext.tree.TreeNode({
            text: 'NorArgo',
            expanded: true});
        treeRoot.replaceChild(floatsTree, treeRoot.childNodes[0]);

        var layer;
        var node;

        layer = createProfileLayer("Alle floats", headLayer, true);
        node = {nodeType: "gx_layer", "leaf": true, "text": "Alle floats", "layer": layer.getLayer(), "id": "sist60_point"}
        floatsTree.appendChild(node);

        layer = createProfileLayer("Siste 60 dager path",tailLayer, true);
        node = {nodeType: "gx_layer", "leaf": true, "text": "Siste 60 dager", "layer": layer.getLayer(), "id": "sist60"}
        floatsTree.appendChild(node);

        var layerList = [];
        /* For better performance all layers should be added to layer store via one
         * call to add/insert instead of as they are created.  So will push layers
         * into layerLIst array then add array
         */
//		    var root = treeRoot.getRootNode().appendChild(new Ext.tree.AsyncTreeNode({
        var root = floatsTree.appendChild(new Ext.tree.AsyncTreeNode({
            text: 'Floats',
            loader: new Ext.tree.TreeLoader({
                url: 'spring/getNorArgoChildNodes.html',
                createNode: function (attr) {
                    attr.nodeType = "gx_layer";

                    var layerText;
                    var sqlParam;
                    var profile;
                    if (attr.text == "Punkter") {
                        var id = attr.idPlatform;
                        sqlParam = 'id_platform:' + id;
                        layerText = "Punkter";
                        profile = true;
                    } else if (attr.text == "Linjer") {
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
                                viewparams: sqlParam
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
                        app.mapPanel.layers.insert(0, [record]);
                    }
                    attr.layer = record.getLayer();
                    return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
                },
                listeners: {
                    load: function () { // Event fires after nodes are loaded
                        var firstLayer = layerList.pop();
                        app.mapPanel.layers.add(layerList); // Add all excepted first layer via add function for speed
                        app.mapPanel.layers.insert(0, firstLayer); // Add first layer via insert to cause all setup events to fire

                        layerList = false; //Sublayers will be added directly

                    }
                }
            })
        }));

    });
});

