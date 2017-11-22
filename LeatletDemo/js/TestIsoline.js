/*
 * 测试等值线生成程序
 */
var LeafletMap = (function(){
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
	    
	    getDataFromJson();
	};
	
	var getDataFromJson = function(){
		var htmlobj = $.ajax({
			url: "http://218.28.7.251:10525/hnqxjson/QxSqlInter/findDataSetOnDataType.hd?dataType=1-3-2&cityCode=HN",
			async: false,
			success: function() {
				setTimeout(function() {
				}, 1);
			}
		});
		var listObj = JSON.parse(htmlobj.responseText).list;
//		for(var j = 0; j < listObj.length; j++) {
//			
//			var eValue = listObj[j].eValue;
//			if(eValue !== null) {
//				var city = [listObj[j].longitude, listObj[j].latitude];
//			}
//		}
		var interpolateFeatures = ContourLine.createNew().BandLayer(listObj); //温度色斑图配置文件一项，选择哪种数据类型，都是同样的显示效果
		interpolateFeatures.addTo(map);
	};
	
	return{
		InitMap:initMap
	};
})();