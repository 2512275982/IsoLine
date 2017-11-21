/*
 * LeafletMap模块，包括地图的基本方法，初始化地图，增加指定图层等 
 * */
var LeafletMap = (function(){
	var trackLine;  //飞行轨迹图层
	var polutionPolygonLyr;  //面状污染源图层
	var pntPolutionLyr;   //点状污染源图层
	var enterpriseLyr; //企业信息图层
	var map;
	
	
	var initMap = function(){
		 map = L.map('map',{
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
	
	var showTrackLineLyr = function(trackInfoListObj){
		if(trackLine === undefined){
			trackLine = TrackLineMClass.createNew();
			trackLine.getTrackLineLayer().addTo(map);
		}

		trackLine.addTrackLineToLayer(trackInfoListObj);
		var bounds = trackLine.getTrackLineLayer().getBounds();
		map.fitBounds(bounds);
	};
	
	return{
		InitMap:initMap,
		ShowTrackLineLyr:showTrackLineLyr
	};
})();