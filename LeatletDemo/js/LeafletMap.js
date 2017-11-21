var init = function(){
	var normalm = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
	    maxZoom: 18,
	    minZoom: 5
	});
	var imgm = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
	    maxZoom: 18,
	    minZoom: 5
	});
	var imga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
	    maxZoom: 18,
	    minZoom: 5
	});
	var normal = L.layerGroup([normalm]),
	    image = L.layerGroup([imgm, imga]);
	var baseLayers = {
	    "地图": normal,
	    "影像": image,
	}
	var map = L.map("mapid", {
	    center: [31.59, 120.29],
	    zoom: 12,
	    layers: [normal],
	    zoomControl: false
	});
	L.control.layers(baseLayers, null).addTo(map);
	L.control.zoom({
	    zoomInTitle: '放大',
	    zoomOutTitle: '缩小'
	}).addTo(map);
};
