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

		contourSO2.IsoLineLayer = function(listData, splitValues,splitColors) {
			isolineLyr.clearLayers() //添加数据之前首先清空上次的数据
			var listPolys;
			isolineLyr.clearLayers();
			var gridClass = GridClass.createNew(listData);
			var gridInfo = gridClass.GetGrids();

			var lines = GridIsoline.createNew(gridInfo);
			var lineResults = lines.WikiIsoline(splitValues);
			var yMax = gridClass.getYmax(),
				yMin = gridClass.getYmin(),
				xMax = gridClass.getXmax(),
				xMin = gridClass.getXmin();
			
//			var listPolys = lines.WikiIsolineBand(lineResults,yMax,yMin,xMax,xMin);
//			var polyColor,poly;
//			for(var index = 0;index < listPolys.length;index++){
//				poly = listPolys[index];
//				if(poly.maxValue !== undefined){
//					polyColor = splitColors[splitValues.indexOf(poly.maxValue)+1];
//				} else {
//					polyColor = splitColors[splitValues.indexOf(poly.minValue)];
//				}
//
//				var outRingCoors = [];
//				poly.outerRings.vertries.forEach(function(pt, k) {
//					var coord = trans.PT([pt[1], pt[0]]);
//					outRingCoors.push(coord);
//				})
//				if(poly.interRings.length>0){
//					var polyCoord = new Array();
//					polyCoord.push(outRingCoors);
//					
//					for(var ii = 0;ii<poly.interRings.length;ii++){
//						var interRings = [];
//						poly.interRings[ii].vertries.forEach(function(pt, k) {
//							var coord = trans.PT([pt[1], pt[0]]);
//							interRings.push(coord);
//						})
//						polyCoord.push(interRings);
//					}
//					var polygon = L.polygon(polyCoord, {stroke:true,opacity:0.7,fillOpacity:0.9,color: polyColor});
//					isolineLyr.addLayer(polygon);
//				}
//				else{
//					var polygon = L.polygon(outRingCoors, {stroke:true,opacity:0.7,fillOpacity:0.9,color: polyColor});
//					isolineLyr.addLayer(polygon);
//				}
//			}

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
			
			var sunCount = 0;
			var txt = "";
			var color = "black",weight = 1;
			for(var i = 0; i < lineResults.length; i++) {
				color = "black",weight = 1;
				var lines = lineResults[i];
				if(!lines.FinishState){
					sunCount++;
					var pntInfo = lines.GetLineFrom();
					coord = trans.PT([pntInfo.Y, pntInfo.X]);
					var circle = L.circle(coord, { radius: 2, fillColor: "red",fillOpacity:1,stroke:false }).bindTooltip(pntInfo.X+"  "+pntInfo.Y);
					isolineLyr.addLayer(circle);
					txt += pntInfo.X+"  "+pntInfo.Y+"\r\n";
					pntInfo = lines.GetLineEnd();
					coord = trans.PT([pntInfo.Y, pntInfo.X]);
					circle = L.circle(coord, { radius: 2, fillColor: "red",fillOpacity:1,stroke:false }).bindTooltip(pntInfo.X+"  "+pntInfo.Y);
					isolineLyr.addLayer(circle);
					
					txt += pntInfo.X+"  "+pntInfo.Y+"\r\n";
					color = "red";
					weight = 2;
					continue;
				}
				var transLine = [];
				lines.ListVertrix.forEach(function(pt, k) {
					var coord = trans.PT([pt.Y, pt.X]);
					transLine.push(coord);
				})
				var polyg = L.polyline(transLine, { color: color,weight:weight });
				isolineLyr.addLayer(polyg);

				var labelPnt = trans.PT([lines.Label.LabelPnt.Y, lines.Label.LabelPnt.X]);
				var marker = L.marker(labelPnt, {
					icon: L.divIcon({
						html: '<div style="font-size:14px;color:#FF0000">' + lines.Label.Value + '</div>'
					}),
				})
				isolineLyr.addLayer(marker);
			}
			alert(sunCount);
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

		return contourSO2;

		function getPntColor(value, dataType, splitValues,splitColors) {
			var index = 0;
			switch(dataType) {
				case "SO2":
					index = getValueGrade(value, splitValues);
				case "NO2":
					index = getValueGrade(value, splitValues);
				case "CO":
					index = getValueGrade(value, splitValues);
				case "O3":
					index = getValueGrade(value, splitValues);
				case "PM25":
					var index = getValueGrade(value, splitValues);
				case "PM10":
					var index = getValueGrade(value, splitValues);
				default:
					break;
			}
			return splitColors[index];
		}
		function getValueGrade(value, splitValues) { 
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