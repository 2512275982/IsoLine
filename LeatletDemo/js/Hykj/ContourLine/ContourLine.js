/*污染面源展示相关内容*/
var ContourLine = {
	createNew: function() {
		var contourSO2 = {};
		var contourBandLyr = L.featureGroup([]);
	
		contourSO2.BandLayer = function(listData,bandColors) {
			var listPolys;
			var gridClass = GridClass.createNew(listData);
			var gridInfo = gridClass.GetGrids();
			var isosurface = GridIsoSurface.createNew(gridInfo);
			listPolys = isosurface.WikiIsosurface(bandColors);
			listPolys.forEach(function(item) {
				var coords = [];
				item.ListPolygonVertrix().forEach(function(pnt) {
					// 对多边形进行偏移处理
					var coord = trans.PT([pnt.Y, pnt.X]);
					coords.push(coord);
				});
				var polyg = L.polygon(coords, {
					smoothFactor: 0,
					stroke: false,
					fillColor: item.ColorValue(),
					fillOpacity: 0.9,
				});
				contourBandLyr.addLayer(polyg);
			})
			
			var lines = new Isoline(gridInfo);
			var lineResults = lines.action();
	
			for(var index in lineResults) {
				var lines = lineResults[index];
				lines.forEach(function(line, j) {
					var transLine = [];
					line.forEach(function(pt, k) {
						var coord = trans.PT([pt[0], pt[1]]);
						transLine.push(coord);
					})
					var polyg = L.polyline(transLine, { color: 'black' });
					contourBandLyr.addLayer(polyg);
				})
			}
			return contourBandLyr;
		};
		return contourSO2;
	}};