/*
 * 测试等值线生成程序
 */
var LeafletMap = (function() {
	var map;

	var initMap = function() {
		map = L.map('map', {
			fullscreenControl: {
				pseudoFullscreen: false
			}
		}).setView([31.59, 120.29], 7);

		var layers = [];
		for(var providerId in providers) {
			layers.push(providers[providerId]);
		}
		var ctrl = L.control.iconLayers(layers).addTo(map);
		L.Control.boxzoom({ position: 'topleft' }).addTo(map);
		L.control.defaultExtent().addTo(map);

		getDataFromJson();
	};

	/*
	 * 初始化网格数据格式，传入的值为经纬度以及Z值的列表
	 */
	var gridOrignPnts = function(listData) {
		var listGridOrignPnts = new Array();
		listData.forEach(function(item) {
			if(item.longitude < 110.35 || item.longitude > 116.65) {
				return true;
			}
			if(item.latitude < 31.383 || item.latitude > 36.37) {
				return true;
			}
			var pntClass = new PointInfo(item.longitude, item.latitude, item.eValue);
			listGridOrignPnts.push(pntClass);
		});
		return listGridOrignPnts;
	};

	var getDataFromJson = function() {
		var htmlobj = $.ajax({
			url: "http://218.28.7.251:10525/hnqxjson/QxSqlInter/findDataSetOnDataType.hd?dataType=1-3-2&cityCode=HN",
			async: false,
			success: function() {
				setTimeout(function() {}, 1);
			}
		});
		var listObj = JSON.parse(htmlobj.responseText).list;

		var pm25Colors = new Array();
		pm25Colors.push({
			value: 8,
			color: '#00E400'
		});
		pm25Colors.push({
			value: 9,
			color: '#FFFF00'
		});
		pm25Colors.push({
			value: 10,
			color: '#FF7E00'
		});
		pm25Colors.push({
			value: 11,
			color: '#FF0000'
		});
		pm25Colors.push({
			value: 12,
			color: '#99004C'
		});
//		pm25Colors.push({
//			value: 14,
//			color: '#7E0023'
//		});

		var listData = gridOrignPnts(listObj);
		var interpolateFeatures = ContourLine.createNew().BandLayer(listData, pm25Colors); //温度色斑图配置文件一项，选择哪种数据类型，都是同样的显示效果
		interpolateFeatures.addTo(map);
	};

	return {
		InitMap: initMap
	};
})();