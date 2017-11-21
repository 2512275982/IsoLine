/*污染面源展示相关内容*/
var ContourLineSO2 = {
	createNew:function(listData){
		var contourSO2 = {};
		var contourBandLyr = L.featureGroup([]);
		var AreaDefault = {
	        stroke:false,
	        fill:true,
	        fillColor:'#3388ff',
	        fillOpacity:0.2,
	        fillRule:'evenodd',
	        bubblingMouseEvents:false,
	        smoothFactor:1
	    };
	    var gridOrignPnts = function(listData){
			var listGridOrignPnts = new Array();
			listData.forEach(function(item) {
				PointInfoClass pntClass = PointInfoClass.createNew(item.lon,item.lat,item.so2);
				listGridOrignPnts.push(pntClass);
			}
	    	
	    };
		
		var contourInfos = new Array();
		contourInfos.push({value:0,color:'#3388ff'});
		contourInfos.push({value:50,color:'#3388ff'});
		contourInfos.push({value:100,color:'#3388ff'});
		contourInfos.push({value:150,color:'#3388ff'});
		contourInfos.push({value:200,color:'#3388ff'});
		contourInfos.push({value:250,color:'#3388ff'});
		contourInfos.push({value:300,color:'#3388ff'});
		contourInfos.push({value:350,color:'#3388ff'});
		contourInfos.push({value:400,color:'#3388ff'});
		contourInfos.push({value:450,color:'#3388ff'});
		contourInfos.push({value:500,color:'#3388ff'});
		contourInfos.push({value:550,color:'#3388ff'});
		contourInfos.push({value:600,color:'#3388ff'});
		contourInfos.push({value:650,color:'#3388ff'});
		contourInfos.push({value:700,color:'#3388ff'});
		contourInfos.push({value:750,color:'#3388ff'});
		
		contourSO2.BandLayer = function(){
			return contourBandLyr;
		};
		
	}
};
var ContourBandStyle = {
	createNew:function(color){
		var bandStyle = {
			stroke:false,
	        fill:true,
	        fillColor:color,
	        fillOpacity:0.2,
	        fillRule:'evenodd',
	        bubblingMouseEvents:false,
	        smoothFactor:1
		};
		return bandStyle;
	}
};