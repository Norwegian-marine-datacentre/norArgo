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
Ext.ns("NorArgo.plugins");

NorArgo.Composer  = Ext.extend(GeoExplorer.Composer, {
    constructor: function(config) {
    	NorArgo.Composer.superclass.constructor.apply(this, arguments);
        this.on("beforecreateportal", this.modifyPortal, this);
        console.log("config is",config)
      
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
            xhtml:"<div id='titlePanel'>NorArgo: en Norsk Argo infrastruktur</div>",
	    html:"<div id='titlePanel'></div>"
        });   
        
        this.portalItems[0].items.push( northPanel );
    }
      
});
