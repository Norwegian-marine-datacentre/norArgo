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

	console.log("map ",this.map.map.center,this.map.map.resolution);
	
        layers.each(function layer(x) {
            var layer = x.getLayer();
//	    console.log("a",layer,layer.params.ISPROFILE);

	    
            //Only interested in platform points
            if ((layer.params.ISPROFILE) || ( layer.params["VIEWPARAMS"] &&
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
    addProfileDetails: function (platform, feature, panel) {

        panel.items.push({
            xtype: 'label',
            html: 'Program:'
        });

        panel.items.push({
            xtype: 'displayfield',
            html: platform.program
        });

        panel.items.push({
            xtype: 'label',
            html: 'Country:'
        });

        panel.items.push({
            xtype: 'displayfield',
            html: platform.country
        });

        panel.items.push({
            xtype: 'label',
            html: 'Model:'
        });

        panel.items.push({
            xtype: 'displayfield',
            html: platform.model
        });

        panel.items.push({
            xtype: 'label',
            html: 'Date :'
        });

        panel.items.push({
            xtype: 'displayfield',
            html: feature.date
        });
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
                width: 600,
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
                                layout: 'table',
                                layoutConfig: {columns: 2},
                                width: 150,
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

