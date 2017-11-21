var ProjectInfoShow = (function(){
	var enterprise;  //企业信息
	var leafletMap;
	
	var initMap = function(){
		leafletMap = LeafletMapClass.createNew();
		leafletMap.mapZoomEventOn(zoomFun);
	};
	
	var zoomFun = function (e){
		var zoomNum = leafletMap.map.getZoom();
		if(enterprise !== undefined){
			
		}
	};
	
	var showEnterprise = function(companyJsonObj){
		var zoomNum = map.getZoom();
		if(enterprise === undefined){
			
		}
		else{
			//polution.clearPolutionData();
		}
		
		//polution.addDataToLayer(ariInfoListObj);
	};
	
	return{
		InitMap:initMap,
		ShowEnterprise:showEnterprise
	};
})();