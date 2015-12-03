/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * @requires GeoExplorer.js
 */

/** api: (define)
 *  module = GeoExplorer
 *  class = GeoExplorer.Composer(config)
 *  extends = GeoExplorer
 */

/** api: constructor
 *  .. class:: GeoExplorer.Composer(config)
 *
 *      Create a GeoExplorer application intended for full-screen display.
 */
Ext.ns("ArcticRoos.plugins");


(function() {
    Ext.preg("gxp_layermanager", gxp.plugins.LayerTree);
})();

ArcticRoos.Composer  = Ext.extend(GeoExplorer.Composer, {
    constructor: function() {
        
        //UGLY prototpye hack to change group names
        	gxp.plugins.LayerTree.prototype.baseNodeText = "Base Layer";
	gxp.plugins.LayerTree.prototype.overlayNodeText = "Arctic Roos";
        
    	ArcticRoos.Composer.superclass.constructor.apply(this, arguments);  
    	this.on("beforecreateportal", this.modifyPortal, this);
    },
    
    loadConfig: function(config) {
        
        config.tools.splice(0, 0 ,{
            ptype: "gxp_legend",
            outputTarget: "legend"
        });
        ArcticRoos.Composer.superclass.loadConfig.call(this, config);
    },
    
    modifyPortal: function() {
        var toolbar = this.portalItems[0].tbar;
        this.portalItems[0].tbar = null;
        
        var northPanel = new Ext.Panel({
            border: true,
            region: "north",
            split: true,
            height: 150,
           // bbar: toolbar,
            id: "topPanelHeading",
            collapseMode: "mini",
            //bodyStyle: "background-image:url('theme/app/img/background_body_None.jpg')",
            html:jQuery("#headerDiv").html()
        }); 
        
        var westPanel = new gxp.CrumbPanel({
            region: "center",
            width: 320,
            height: 300,
            split: true,
            id: "tree",
            collapsible: true,
            collapseMode: "mini",
            hideCollapseTool: true,
            header: false,
            border: true,
            collapsible: true,
            collapseMode: "mini"
        });

        this.portalItems = [{
            region: "center",
            layout: "border",
        //    tbar: toolbar,
            items: [
                northPanel,
                this.mapPanelContainer,
                {
                  xtype: "panel",
                  region: "west",
                  width: 200,
                  layout: "border",
                  items: [
                    westPanel, {
                      xtype: "panel",
                      region: "south",
                      id: "legend",
                      height: 200,
                      layout: "fit",
                      border: true,
                      collapsible: true,
                      collapseMode: "mini"
                  }]
                }
            ]
        }];
        
    }
});
