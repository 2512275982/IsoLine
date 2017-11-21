/*企业信息展示相关内容*/
var EnterpriseModule = (function(){
	var LeafIcon = L.Icon.extend({
	    options: {
	        shadowUrl: '../img/icons/EnterpriseIcon/blue.png',
	        iconSize:     [22, 24],  //38, 95
	        shadowSize:   [50, 64],
	        iconAnchor:   [22, 94],
	        shadowAnchor: [4, 62],
	        popupAnchor:  [-3, -76]
	    }
	});
	
	var enterpriseIcon = {};
	enterpriseIcon.Default = new LeafIcon({iconUrl: './img/icons/EnterpriseIcon/blue.png'});
	enterpriseIcon.Red = new LeafIcon({iconUrl: './img/icons/EnterpriseIcon/red.png'});
	enterpriseIcon.Gray = new LeafIcon({iconUrl: './img/icons/EnterpriseIcon/gray.png'});
	
	var getEnterpriseLayer = function(strJson){
		var enterLayer = L.layerGroup([]);
		for(var i = 0;i<list.length;i++){
			var marker = L.marker([51.5, -0.09], {icon: greenIcon}).bindPopup("I am a green leaf.");
			enterLayer.addLayer(marker);
		}
		return enterLayer;	
	};
	
	return {
		GetEnterpriseLayer:getEnterpriseLayer
	}
})();