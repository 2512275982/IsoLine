/*污染面源展示相关内容*/
var PolutionClass = {
	createNew:function(){
		var maxZoom = 10,minZoom = 3;  //比例尺可见控制
		var polution ={};
		var polyPolutionLyr = L.featureGroup([]);
		var pntPolutionLyr = L.featureGroup([]);
		var AreaDefault = {
	        stroke:true,
	        color:'#3388ff',
	        weight:3,
	        opacity:1,
	        lineCap:'round',
	        lineJoin:'round',
	        fill:true,
	        fillColor:'#3388ff',
	        fillOpacity:0.2,
	        fillRule:'evenodd',
	        bubblingMouseEvents:false,
	        smoothFactor:1
	   };
		
		var poluPolygonIcon = {};
		poluPolygonIcon.Default = AreaDefault;
		
		polution.getPointPolutionLayer = function(){
			return pntPolutionLyr;
		};
		
		polution.getPolyPolutionLayer = function(){
			return polyPolutionLyr;
		};
		
		polution.clearPolutionData = function(){
			pntPolutionLyr.clearLayers();
			polyPolutionLyr.clearLayers();
		};
		
		polution.addDataToLayer = function(trackInfoList){
//			var polygs = [];
			objs.map(function(obj, index) {
				var ARI_LONGI_LATIS = obj['ARI_LONGI_LATIS'];
				var coordObjs = JSON.parse(ARI_LONGI_LATIS)['大地坐标'];
				var coords = [];
				coordObjs.map(function(obj, index) {
					var coord = trans.blh_LatLon(obj);
					// 对多边形进行偏移处理
					coord = trans.PT(coord);
					coords.push(coord);
				})
				var polyg = L.polygon(coords, poluPolygonIcon.Default).bindPopup(
					"<p style='width:110px;margin:5px 0;display:inline-block'>类型名:" +
					obj['ARI_TYPENAME'] +
					"</p><p style='width:110px;margin:5px 0;display:inline-block'>单位:" +
					obj['SHAPE_UNIT_NAME'] +
					"</p><br /><p style='width:110px;margin:5px 0;display:inline-block'>数值:" +
					parseFloat(
						obj['SHAPE_VALUE'])
					.toFixed(2) +
					"</p><p style='width:110px;margin:5px 0;display:inline-block'>照片名:" +
					obj['ARI_NAME'] +
					"</p><br /><img style='width:220px;height:150px' src='" +
					obj['API_FILE'] +
					"'/>", {
						autoPan: true,
						keepInView: false, // 防止在视图外部显示已经打开的pop
						closeButton: true,
						autoClose: false,
						closeOnClick: true
					}).bindTooltip(
					'<div><p>' +
					parseFloat(
						info['SHAPE_VALUE'])
					.toFixed(2) +
					'</p></div>', {
						className: 'leaflet-div-polygonLabel',
						opacity: 0.8,
						permanent: true,
						direction: 'center',
						interactive: true
					}).openTooltip();
				polyPolutionLyr.addLayer(polyg);
//				polygs.push(polyg);
			});
		};
	}
};
