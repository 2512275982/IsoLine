var LeafletMapClass = {
	createNew:function(){
			var leafletMap = {};
			leafletMap.initMap = function(){
				leafletMap.map = L.map('map',{
			    fullscreenControl: {
			        pseudoFullscreen: false
			       }
			    }).setView([31.59, 120.29], 7);            
		
		    var layers = [];
		    for (var providerId in providers) {
		        layers.push(providers[providerId]);
		    }
		    var ctrl = L.control.iconLayers(layers).addTo(map); 
		    L.Control.boxzoom({ position:'topleft' }).addTo(map);
		    L.control.defaultExtent().addTo(map);
		};
		
		leafletMap.mapZoomEventOn = function(funName){
			leafletMap.map.on('zoom',funName);
		}
		
		return leafletMap;
	}
};
