//var layers = [];
var store = new GeoExt.data.LayerStore();
function createOLSourceLayerRecord(title, url, layername) {
	
	var OLRecord;
	OLRecord = gxp.plugins.OLSource.prototype.createLayerRecord({
		source: "ol",
	    type: "OpenLayers.Layer.WMS",
	    group: "gruppe",
	    queryable: true,
	    visibility: true,            
	    args: [
	           title,
	           url,
	           {layers: layername, format: "image/png", transparent: true},
	           {
	        	   opacity: 1,
	               units: "m",
	               singleTile:true,
	               buffer: 0, //getting no boarder around image - so panning will get a new image.
	               ratio: 1 //http://dev.openlayers.org/releases/OpenLayers-2.12/doc/apidocs/files/OpenLayers/Layer/Grid-js.html#OpenLayers.Layer.Grid.ratio                                        
	           }
	    ]
	})           
//layers.push(OLRecord);
	store.add( OLRecord );  
	
	return store;
}