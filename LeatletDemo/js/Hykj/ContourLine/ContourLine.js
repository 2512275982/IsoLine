/*污染面源展示相关内容*/
var ContourLine = {
	createNew: function() {
		var contourSO2 = {};
		var contourBandLyr = L.featureGroup([]);
		var isolineLyr = L.featureGroup([]);
		var pntLayer = L.featureGroup([]);

		contourSO2.getPntLayer = function() {
			return pntLayer;
		}

		contourSO2.getIsolineLyr = function() {
			return isolineLyr;
		}

		contourSO2.getContourBandLyr = function() {
			return contourBandLyr;
		}

		contourSO2.ShowPnt = function(listData, dataType, splitValues) {
			pntLayer.clearLayers() //添加数据之前首先清空上次的数据
			var pntInfo, coord;
			for(var i = 0; i < listData.length; i++) {
				pntInfo = listData[i];
				coord = trans.PT([pntInfo.Y, pntInfo.X]);
				var cirColor = getPntColor(pntInfo.Z, dataType, splitValues,splitColors);
				var circle = L.circle(coord, { radius: 60, fillColor: cirColor,fillOpacity:1,stroke:false }).bindTooltip((pntInfo.Z?pntInfo.Z:"").toString());
				pntLayer.addLayer(circle);
			}
			return pntLayer;
		}

		contourSO2.IsoLineLayer = function(listData, splitValues) {
			isolineLyr.clearLayers() //添加数据之前首先清空上次的数据
			var listPolys;
			isolineLyr.clearLayers();
			var gridClass = GridClass.createNew(listData);
			var gridInfo = gridClass.GetGrids();

			var lines = GridIsoline.createNew(gridInfo);
			var lineResults = lines.WikiIsoline(splitValues);

			var outLine = [];
			var coord = trans.PT([gridClass.getYmin(), gridClass.getXmin()]);
			outLine.push(coord);
			var coord = trans.PT([gridClass.getYmin(), gridClass.getXmax()]);
			outLine.push(coord);
			var coord = trans.PT([gridClass.getYmax(), gridClass.getXmax()]);
			outLine.push(coord);
			var coord = trans.PT([gridClass.getYmax(), gridClass.getXmin()]);
			outLine.push(coord);
			var coord = trans.PT([gridClass.getYmin(), gridClass.getXmin()]);
			outLine.push(coord);
			var polyg = L.polyline(outLine, { color: 'black' });
			isolineLyr.addLayer(polyg);

			for(var i = 0; i < lineResults.length; i++) {
				var lines = lineResults[i];
				var transLine = [];
				lines.ListVertrix.forEach(function(pt, k) {
					var coord = trans.PT([pt.Y, pt.X]);
					transLine.push(coord);
				})
				var polyg = L.polyline(transLine, { color: 'black' });
				isolineLyr.addLayer(polyg);

				var labelPnt = trans.PT([lines.Label.LabelPnt.Y, lines.Label.LabelPnt.X]);
				var marker = L.marker(labelPnt, {
					icon: L.divIcon({
						html: '<div style="font-size:14px;color:#FF0000">' + lines.Label.Value + '</div>'
					}),
				})
				isolineLyr.addLayer(marker);
			}
			return isolineLyr;
		};

		contourSO2.BandLayer = function(listData, splitValues, splitColors) {
			contourBandLyr.clearLayers() //添加数据之前首先清空上次的数据
			var listPolys;
			var gridClass = GridClass.createNew(listData);
			var gridInfo = gridClass.GetGrids();
			var isosurface = GridIsoSurface.createNew(gridInfo);
			listPolys = isosurface.WikiIsosurface(splitValues, splitColors);
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
					fillOpacity: 0.9
				});
				contourBandLyr.addLayer(polyg);
			})
			return contourBandLyr;
		};

		contourSO2.BandLayerCols = function() {
			var cols = {};
			cols.SO2 = ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'];
			cols.NO2 = [];
			cols.CO = [];
			cols.O3 = [];
			cols.PM25 = [];
			cols.PM10 = [];
			return cols;
		}

		return contourSO2;

		function getPntColor(value, dataType, splitValues,splitColors) {
			var index = 0;
			switch(dataType) {
				case "SO2":
					index = getValueGrade(value, splitValues);
					//var col = contourSO2.BandLayerCols().SO2[index];
					 //col;
				case "NO2":
					var index = getValueGrade(value, splitValues);
					//var col = contourSO2.BandLayerCols().NO2[index];
//					return 'red' //col;
				case "CO":
					var index = getValueGrade(value, splitValues);
					//var col = contourSO2.BandLayerCols().CO[index];
//					return 'red' //col;
				case "O3":
					var index = getValueGrade(value, splitValues);
					//var col = contourSO2.BandLayerCols().O3[index];
//					return 'red' //col;
				case "PM25":
					var index = getValueGrade(value, splitValues);
					//var col = contourSO2.BandLayerCols().PM25[index];
//					return 'red' //col;
				case "PM10":
					var index = getValueGrade(value, splitValues);
					//var col = contourSO2.BandLayerCols().PM10[index];
//					return 'red' //col;
				default:
					break;
			}
			return splitColors[index];
		}
		function getValueGrade(value, splitValues) { //默认从小到达排序
			var index = -1;
			for(var i = 0;i<splitValues.length;i++){
				var item = splitValues[i];
				if((value/1)<(item/1)){
					index = i-1;
					break;
				}
			}
			if(index == -1){
				index = splitValues.length-1;
			}
			return index;
		}
	}
};