/*飞行任务展示模块*/
var FlyTaskShow = (function(){
	var trackLine;  //飞行轨迹图层
	var polution;  //面状污染源图层
	var leafletMap;
	
	var initMap = function(){
		leafletMap = LeafletMapClass.createNew();
		leafletMap.mapZoomEventOn(zoomFun);
	};
	
	var zoomFun = function (e){
		var zoomNum = leafletMap.map.getZoom();
		if(polution !== undefined){
			if(zoomNum < polution.zoomNum){
				polution.getPointPolutionLayer().addTo(leafletMap.map);
				polution.getPolyPolutionLayer().removeFrom(leafletMap.map);
			}
			else{
				polution.getPolyPolutionLayer().addTo(leafletMap.map);
				polution.getPointPolutionLayer().removeFrom(leafletMap.map);
			}
		}
		if(trackLine !== undefined){
			if(zoomNum < trackLine.zoomNum){
				trackLine.getTrackNodeLayer().removeFrom(leafletMap.map);
			}
			else{
				trackLine.getTrackNodeLayer().addTo(leafletMap.map);
			}
		}
	};
	
	var showTrackLineLyr = function(trackInfoListObj){
		var zoomNum = leafletMap.map.getZoom();
		if(trackLine === undefined){
			trackLine = TrackLineMClass.createNew();
			trackLine.getTrackLineLayer().addTo(leafletMap.map);
			if(zoomNum > trackLine.zoomNum){
				trackLine.getTrackNodeLayer().addTo(leafletMap.map);
			}
		}
		else{
			trackLine.clearLayerInfos();
		}
		trackLine.addTrackLineToLayer(trackInfoListObj);
		var bounds = trackLine.getTrackLineLayer().getBounds();
		leafletMap.map.fitBounds(bounds);
	};
	
	var showPolution = function(ariInfoListObj){
		var zoomNum = map.getZoom();
		if(polution === undefined){
			polution = PolutionClass.createNew();
			if(zoomNum < polution.zoomNum){
				polution.getPointPolutionLayer().addTo(leafletMap.map);
			}
			else{
				polution.getPolyPolutionLayer().addTo(leafletMap.map);
			}
		}
		else{
			polution.clearPolutionData();
		}
		
		polution.addDataToLayer(ariInfoListObj);
	};
	
	return{
		InitMap:initMap,
		ShowTrackLineLyr:showTrackLineLyr,
		ShowPolution:showPolution
	};
})();