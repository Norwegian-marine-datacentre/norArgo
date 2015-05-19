/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * @requires GeoExplorer.js
 */

/** api: (define)
 *  module = NorArgo
 *  class = NorArgo.Composer(config)
 *  extends = GeoExplorer.Composer
 */

/** api: constructor
 *  .. class:: NorArgo.Composer(config)
 *
 *      Create a NorArgo branded GeoExplorer application 
 */
Ext.ns("Jerico.plugins");

(function() {
    Ext.preg("gxp_layermanager", gxp.plugins.LayerTree);
})();

Jerico.Composer  = Ext.extend(GeoExplorer.Composer, {
    constructor: function() {       
    	Jerico.Composer.superclass.constructor.apply(this, arguments);    
        this.on("beforecreateportal", this.modifyPortal, this);
    },
    
    loadConfig: function(config) {
        
        config.tools.splice(0, 0 ,{
            ptype: "gxp_legend",
            outputTarget: "legend"
        });
        Jerico.Composer.superclass.loadConfig.call(this, config);
    },
    
    modifyPortal: function() {
        var toolbar = this.portalItems[0].tbar;
        this.portalItems[0].tbar = null;
   	
        var northPanel = new Ext.Panel({
            border: true,
            region: "north",
            split: true,
            height: 150,
            bbar: toolbar,
            id: "topPanelHeading",
            collapseMode: "mini",
            html:"" +
            "<div style=\"float:left;\"><img src=\"javascript/jerico_banner.jpg\"/></div><div style=\"float:right;\"><img src=\"javascript/background_top_trans.jpg\"/></div>"       
        });
//        this.portalItems[0].items.push( northPanel );
        
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
            tbar: toolbar,
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
