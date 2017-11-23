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
			
			var lines = GridIsoline.createNew(gridInfo);
			var lineResults = lines.WikiIsoline([12]);
			
			var finishCount = 0;
			for(var i=0;i<lineResults.length;i++) {
				var lines = lineResults[i];
				var transLine = [];
				if(!lines.FinishState)
					count++;
				else{
					finishCount++;
				}
				lines.ListVertrix.forEach(function(pt, k) {
					var coord = trans.PT([pt.Y, pt.X]);
					transLine.push(coord);
				})
				var polyg = L.polyline(transLine, { color: 'black' });
				contourBandLyr.addLayer(polyg);
			}
			alert(count+"  "+finishCount);
			
//			for(var i = 0; i < gridInfo.length; i++) {
				var i = 0,j=0;
//				for(var j = 0; j < gridInfo[i].length; j++) {
					var pntV4 = gridInfo[i][j];
					var circle = L.circle([pntV4.Y, pntV4.X], {
					    color: 'red',
					    fillColor: '#f03',
					    fillOpacity: 0.5,
					    radius: 0.05
					})
					circle.bindPopup(pntV4.Z);
					contourBandLyr.addLayer(circle);
//				}
//			}
			return contourBandLyr;
		};
		return contourSO2;
	}};