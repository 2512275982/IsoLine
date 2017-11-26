/*污染面源展示相关内容*/
var ContourLine = {
	createNew: function() {
		var contourSO2 = {};
		var contourBandLyr = L.featureGroup([]);
	
		contourSO2.BandLayer = function(listData,bandColors) {
			var listPolys;
			var gridClass = GridClass.createNew(listData);
			var gridInfo = gridClass.GetGrids();
//			var isosurface = GridIsoSurface.createNew(gridInfo);
//			listPolys = isosurface.WikiIsosurface(bandColors);
//			listPolys.forEach(function(item) {
//				var coords = [];
//				item.ListPolygonVertrix().forEach(function(pnt) {
//					// 对多边形进行偏移处理
//					var coord = trans.PT([pnt.Y, pnt.X]);
//					coords.push(coord);
//				});
//				var polyg = L.polygon(coords, {
//					smoothFactor: 0,
//					stroke: false,
//					fillColor: item.ColorValue(),
//					fillOpacity: 0.9,
//				});
//				contourBandLyr.addLayer(polyg);
//			})
			
			var lines = GridIsoline.createNew(gridInfo);
			var lineResults = lines.WikiIsoline([10,12,14,16,18]);
			
//			var delauay = DelauneyClass.createNew(listData);
//			var lineResults = delauay.Isoline([18])
			
//			var finishCount = 0;
			for(var i=0;i<lineResults.length;i++) {
				var lines = lineResults[i];
				var transLine = [];
				if(!lines.FinishState){
					count++;
					var circle = L.circle([lines.GetLineFrom().Y, lines.GetLineFrom().X], {
					    color: 'red',
					    fillColor: '#f03',
					    fillOpacity: 0.5,
					    radius: 0.05
					})
					contourBandLyr.addLayer(circle);
					var circle1 = L.circle([lines.GetLineEnd().Y, lines.GetLineEnd().X], {
					    color: 'red',
					    fillColor: '#f03',
					    fillOpacity: 0.5,
					    radius: 0.05
					})
					contourBandLyr.addLayer(circle1);
				}
//				else{
//					finishCount++;
//				}
				lines.ListVertrix.forEach(function(pt, k) {
					var coord = trans.PT([pt.Y, pt.X]);
					transLine.push(coord);
				})
				var polyg = L.polyline(transLine, { color: 'black' });
				contourBandLyr.addLayer(polyg);
				
//				var labelPnt = trans.PT([lines.Label.LabelPnt.Y, lines.Label.LabelPnt.X]);
//				var marker = L.marker(labelPnt, {
//                }).bindTooltip(lines.Label.Value, {
//                      permanent : true,
//                      offset : [ 0, 0 ],// 偏移
////                      direction : "right",// 放置位置
//                      // sticky:true,//是否标记在点上面
//                      className : 'anim-tooltip',// CSS控制
//                  }).openTooltip();
//              contourBandLyr.addLayer(marker);
			}
			return contourBandLyr;
		};
		return contourSO2;
	}};