(function(factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('leaflet'));
    } else {
        window.providers = factory(window.L);
    }
})(function(L) {
    var providers = {};

    providers['GaoDe.Normal.Map'] = {
        title: '平面图',
        icon: 'img/icons/openstreetmap_mapnik.png',
        layer: L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
		    maxZoom: 18,
		    minZoom: 5
		})
    };

    providers['GaoDe.Satellite.Map'] = {
        title: '卫星图',
        icon: 'img/icons/openstreetmap_blackandwhite.png',
        layer: L.layerGroup(
        	[L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
			    maxZoom: 18,
			    minZoom: 5
			}), L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
			    maxZoom: 18,
			    minZoom: 5
			})
		])
    };

    return providers;
});