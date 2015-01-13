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

Jerico.Composer  = Ext.extend(GeoExplorer.Composer, {
    constructor: function() {
    	Jerico.Composer.superclass.constructor.apply(this, arguments);    
        this.on("beforecreateportal", this.modifyPortal, this);
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
        this.portalItems[0].items.push( northPanel );
    }    
       
});
