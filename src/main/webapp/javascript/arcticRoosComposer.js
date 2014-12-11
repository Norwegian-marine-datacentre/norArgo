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

ArcticRoos.Composer  = Ext.extend(GeoExplorer.Composer, {
    constructor: function() {
    	ArcticRoos.Composer.superclass.constructor.apply(this, arguments);  
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
            //bodyStyle: "background-image:url('theme/app/img/background_body_None.jpg')",
            html:"" +
            "<div id=\"visual-portal-wrapper\">" +            
"<div id=\"portal-header\"> " +
"        <p class=\"hiddenStructure\">" +
"          <a href=\"http://arctic-roos.org/observations#documentContent\" accesskey=\"2\">Skip to content.</a> |" +

"          <a href=\"http://arctic-roos.org/observations#portlet-navigation-tree\" accesskey=\"6\">Skip to navigation</a>" +
"       </p>" +

"           <div id=\"portal-logo-custom\">" +
"<div class=\"logowrappertop\">" +
"  <h1 id=\"portal-logo\">" +
"    <a accesskey=\"1\" href=\"http://arctic-roos.org\">Arctic ROOS</a>" +
"  </h1>" +
"</div>" +
"  <div id=\"portal-logo1\">" +
"    <a href=\"mailto:tor.olaussen@nersc.no\">" +
"     Contact: Tor Olaussen" +
"    </a>" +
"  </div>" +
"</div>" +

"          <div id=\"portal-skinswitcher\">" +

"</div>" +
"  <h5 class=\"hiddenStructure\">Sections</h5>" +

"  <ul id=\"portal-globalnav\">" +
"      <li class=\"plain\" id=\"portaltab-index_html\">" +
"          <a href=\"http://arctic-roos.org\">Home</a></li>" +
"      <li class=\"plain\" id=\"portaltab-Members of AROOS\">" +
"          <a title=\"Members of AROOS\" href=\"http://arctic-roos.org/Members%20of%20AROOS\">Member</a></li>" +
"      <li id=\"portaltab-observations\">" +
"          <a title=\"\" href=\"http://arctic-roos.org/observations\">Observations</a></li>" +
"      <li class=\"plain\" id=\"portaltab-forecasting-services\">" +
"          <a title=\"forecasting servers\" href=\"http://arctic-roos.org/forecasting-services\">Forecast</a></li>" +
"      <li class=\"plain\" id=\"portaltab-publications\">" +
"          <a title=\"material and publications\" href=\"http://arctic-roos.org/publications\">Relevant papers</a></li>" +
"      <li class=\"plain\" id=\"portaltab-links\">" +
"          <a title=\"List of projects\" href=\"http://arctic-roos.org/links\">Relevant projects</a></li>" +
"<li class=\"plain\" id=\"portaltab-links\" style=\"float:right;\" ><img src=\"javascript/HI_lite.png\" /></li>"+
"  </ul>" +

"        </div></div>"            
        }); 
        
        this.portalItems[0].items.push( northPanel );
    }
});
