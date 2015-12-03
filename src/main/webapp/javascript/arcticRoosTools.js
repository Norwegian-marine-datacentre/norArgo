var ProfileDisplay = {
    map:null,
    cardPanel:null,
    activeCard:0,
    win:null,
    layerIDs:{},
    controls:[],
    attachTo: function (map) {
        map.layers.on("update", this.updateInfo, this);
        map.layers.on("add", this.updateInfo, this);
        map.layers.on("remove", this.updateInfo, this);
	this.map = map;
    },
    listeners:{
	resize: function(){
	    console.log("Resize",this.cardPanel);
	    if (this.cardPanel.rendered) {
		console.log(this.cardPanel.items.get(this.activeCard).items.get(1));
		//this.addCharts(this.cardPanel.items.get(this.activeCard).items.get(1));
	    }
	},
        beforehide:function(){
	    this.removeAll(true);
	    this.doLayout();
	    this.cardPanel=null;
            console.log("close and cleanup");
        }
    },
    updateInfo: function () {
	var self = this;
	var layers = this.map.layers.queryBy(function (x) {
            return x.get("queryable") && !self.layerIDs[x.id];
        });
     
        layers.each(function layer(x) {
            var layer = x.getLayer();
	 
            //Only interested in platform points
            if (layer.params["VIEWPARAMS"] &&
                (
		    (layer.params["VIEWPARAMS"]== "type:PF") ||
			(layer.params["VIEWPARAMS"]== "type:BA") ||
			(layer.params["VIEWPARAMS"]== "type:CT") ||
			(layer.params["VIEWPARAMS"]== "type:MO") ||
			(layer.params["VIEWPARAMS"]== "type:TE") )){
                var control = new OpenLayers.Control.WMSGetFeatureInfo({
                    url: layer.url, 
                    queryVisible: true,
                    layers: [layer],
		    isProfile:true,  //Hacky flag so does not display when identify is active
                    //infoFormat: "application/json",
                    infoFormat: "application/vnd.ogc.gml",
                    vendorParams: {"VIEWPARAMS": layer.params["viewparams".toUpperCase()]},
                    eventListeners: {
                        getfeatureinfo:this.showGraphs,
			scope:this
                    }});
                self.map.map.addControl(control);

                control.activate();
		self.layerIDs[layer.id]=true;
		self.controls.push(control);
            }
        },this);
	console.log("Update info for window with ",self.controls.length);
    },
    addCard: function(card) {
	if (!this.cardPanel) {
	    console.log("create card panel");
	    var navHandler = function(direction){
		if (this.cardPanel.getComponent(this.activeCard+direction)) {
		    this.activeCard = this.activeCard+direction;
		    this.cardPanel.getLayout().setActiveItem(this.activeCard);
		    this.cardPanel.doLayout();
		    this.addCharts(this.cardPanel.getComponent(this.activeCard).getComponent(1));
		    this.cardPanel.getBottomToolbar().getComponent('move-prev').setDisabled(this.activeCard==0);
		    this.cardPanel.getBottomToolbar().getComponent('move-next').setDisabled(!this.cardPanel.getComponent(this.activeCard+1));
		}
	    };
	    this.cardPanel = new Ext.Panel({
		layout:'card',
		activeItem: 0, 
		defaults: {
		    border:false
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
	   // this.doLayout();
	} 
	this.cardPanel.add(card);
	//this.cardPanel.doLayout();
    },
    addProfileDetails: function(feature,date,panel) {
	
	panel.items.push({
	    xtype:'label',
	    html:'Data type:'
	});
	
	panel.items.push({
	    xtype:'displayfield',
	    html:feature.data_type
	});

	panel.items.push({
	    xtype:'label',
	    html:'Area:'
	});

	panel.items.push({
	    xtype:'displayfield',
	    html:feature.area
	});

	panel.items.push({
	    xtype:'label',
	    html:'Institution:'
	});

	panel.items.push({
	    xtype:'displayfield',
	    html:feature.institution
	});


	panel.items.push({
	    xtype:'label',
	    html:'Date:'
	});
	 
	panel.items.push({
	    xtype:'displayfield',
	    html:date
	});
    }, 
    setupProfileCharts: function(id,date,panel,first,commingSoon) {
	var self = this;

	var noDataMessage = "No profile found";
	if (commingSoon) {
	    noDataMessage = "Data presentation coming soon";
	}

	
	Ext.Ajax.request({
            url: 'spring/arcticRoos/platformMeaurement',
            method: 'GET',
            params: {id: id,date: date},
            success: function (responseObject) {
		var chartData = Ext.decode(responseObject.responseText);
		if (jQuery.isEmptyObject(chartData)) {

		    var chartPanel = new Ext.Panel({
			html:noDataMessage
		    });
		    panel.add(chartPanel);
		} else {
		    
 		Ext.iterate(chartData, function(key, value) {
		    var chartPanel = new Ext.Panel({
			html:"loading chart..."
		    });
		    
		    var tab = new Ext.Panel({
			layout:"fit",
			chartData: {name: key,
				    data: value},
			title:key,
			xxitems:chartPanel
		    });
		    panel.add(tab);
		    
		});
		}
		panel.setActiveTab(0);
		if (first ) {
		    self.win.doLayout();
		    self.win.show();
		    self.addCharts(panel);
		    self.cardPanel.getBottomToolbar().getComponent('move-next').setDisabled(!self.cardPanel.getComponent(self.activeCard+1));
		}
		
	    }});
    },
    removeCharts: function(tabPanel) {
	//TODO clean up charts
    },
    addCharts: function(tabPanel) {
	tabPanel.items.each(function (tab) {
	    if ( tab.chartData) {
	    tab.doLayout(true);
	    jQuery("#"+tab.id).highcharts({
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
	    }
	});
    },
    showGraphs: function(featureEvent) {
	var self = this;

	var isCommingSoon= (featureEvent.object.vendorParams["VIEWPARAMS"] == "type:MO");
	
//	console.log("cc",this.map.map.getControlsByClass('OpenLayers.Control.WMSGetFeatureInfo'));
	var cc = this.map.map.getControlsByClass('OpenLayers.Control.WMSGetFeatureInfo');
	var identify = false;
	jQuery.each(cc,function (i,con) {
	    identify = identify || (con.active && !con.isProfile);
	    //console.log(con.active,con.isProfile);
	});
	if (identify) {return};
	
	
	//	console.log(featureEvent);
	if (!this.win) {
	    this.win = new Ext.Window({
	    title:"Profiles",
	    width: 600,
	    height: 450, 
	    layout:"fit",
	    listeners:{
		resize: function(){
		    console.log("Resize",self.cardPanel);
		},
		close: function(){
		    self.cardPanel = null;
		    self.win=null;
		    console.log("Close");
		}}
	});
	}
	
	
	
 
	var features = featureEvent.features;
	for (var i = 0; i < features.length; i++) {
	    var newCard = { 
		xtype: 'panel',
		layout:{
		    type: 'hbox',
		    align: 'stretch'},
		items: [{
		    xtype:'container',
		    layout:'table',
		    layoutConfig: {columns:2},
		    width: 150,
		    items:[]
		},new Ext.TabPanel(  {
		    deferredRender : false,
		    activeTab:0,
		    flex: 1
		})
         	       ]};

	    var ids = features[i].fid.split(".");
	
	
	    self.addProfileDetails(features[i].attributes,ids[2],newCard.items[0]);
	    self.setupProfileCharts(ids[1],ids[2],newCard.items[1],(i==0),isCommingSoon);
	    self.addCard(newCard);
 	}
    }
};


