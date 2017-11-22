/*污染面源展示相关内容*/
var ContourLine = {
	createNew: function() {
		var contourSO2 = {};
		var contourBandLyr = L.featureGroup([]);

		/*
		 * 初始化网格数据格式，传入的值为经纬度以及Z值的列表
		 */
		var gridOrignPnts = function(listData) {
			var listGridOrignPnts = new Array();
			listData.forEach(function(item) {
				var pntClass = PointInfoClass.createNew(item.longitude, item.latitude, item.eValue); 
				listGridOrignPnts.push(pntClass);
			});
			return listGridOrignPnts;
		};
				
		var pm25Colors = new Array();
		pm25Colors.push({
			value: 9,
			color: '#00E400'
		});
		pm25Colors.push({
			value: 10,
			color: '#FFFF00'
		});
		pm25Colors.push({
			value: 11,
			color: '#FF7E00'
		});
		pm25Colors.push({
			value: 12,
			color: '#FF0000'
		});
		pm25Colors.push({
			value: 13,
			color: '#99004C'
		});
		pm25Colors.push({
			value: 14,
			color: '#7E0023'
		});

		contourSO2.BandLayer = function(listData) {
			var listPolys;
			var gridClass = GridClass.createNew(gridOrignPnts(listData));
			listPolys = gridClass.ContourBands(pm25Colors);
			listPolys.forEach(function(item) {
				var coords = [];
				item.ListPolygonVertrix().forEach(function(pnt) {
					// 对多边形进行偏移处理
					var coord = trans.PT([pnt.getY(), pnt.getX()]);
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
			return contourBandLyr;
		};

		contourSO2.BandLayers = function(listData, arry) {
			var listPolys;
			var lyrTypeObjs = {};
			arry.forEach(function(type) {
				var gridClass = GridClass.createNew(gridOrignPnts(listData, type));
				switch(type) {
					case 'CO':
						listPolys = gridClass.ContourBands(coColors);
						break;
					case 'SO2':
						listPolys = gridClass.ContourBands(so2Colors);
						break;
					case 'NO2':
						listPolys = gridClass.ContourBands(no2Colors);
						break;
					case 'O3':
						listPolys = gridClass.ContourBands(o3Colors);
						break;
					case 'PM25':
						listPolys = gridClass.ContourBands(pm25Colors);
						break;
					case 'PM10':
						listPolys = gridClass.ContourBands(pm10Colors);
						break;
				}
				var lyrColorObj = {};
				listPolys.forEach(function(item) {
					var coords = [];
					item.ListPolygonVertrix().forEach(function(pnt) {
						// 对多边形进行偏移处理
						var coord = trans.PT([pnt.getX(), pnt.getY()]);
						coords.push(coord);
					});

					coords.push(coords[0]);
					var poly = turf.polygon([coords]);

					if(!lyrColorObj.hasOwnProperty(item.ColorValue())) {
						lyrColorObj[item.ColorValue()] = new Array();
					}
					lyrColorObj[item.ColorValue()].push(poly);
				})
				//融合要素
				var dissolveLyr = dissolveFeatures(lyrColorObj);

				lyrTypeObjs[type] = dissolveLyr;
			})
			return lyrTypeObjs;
		};

		var dissolveFeatures = function(lyrColorObj) {
			var featureLyrGroup = L.featureGroup([]);
			for(var item in lyrColorObj) {
				var features = turf.featureCollection(lyrColorObj[item]);
				//var dissolved = turf.dissolve(features); //对多边形进行合并处理
				var dissolved = features; //由于使用canvas绘图，不需要再合并处理了,但是这时候leaflet仍然存在地图缩放过小的时候多边形不显示的问题
				var featureLyr = L.geoJSON(dissolved, {
					style: function() {
						return {
							smoothFactor: 0,
							stroke: false,
							fillColor: item,
							fillOpacity: 0.85
						};
					}
				});

				featureLyrGroup.addLayer(featureLyr);
			}
			return featureLyrGroup;
		}

		contourSO2.GetLayer = function() {
			return contourBandLyr;
		};

		/*
		 * 生成指定的色斑图，
		 */
		contourSO2.BandDissolved = function(listData, type) {
			var listPolys;
			var gridClass = GridClass.createNew(gridOrignPnts(listData, type));
			switch(type) {
				case 'CO':
					listPolys = gridClass.ContourBands(coColors);
					break;
				case 'SO2':
					listPolys = gridClass.ContourBands(so2Colors);
					break;
				case 'NO2':
					listPolys = gridClass.ContourBands(no2Colors);
					break;
				case 'O3':
					listPolys = gridClass.ContourBands(o3Colors);
					break;
				case 'PM25':
					listPolys = gridClass.ContourBands(pm25Colors);
					break;
				case 'PM10':
					listPolys = gridClass.ContourBands(pm10Colors);
					break;
			}
			var lyrColorObj = {};
			listPolys.forEach(function(item) {
				var coords = [];
				item.ListPolygonVertrix().forEach(function(pnt) {
					// 对多边形进行偏移处理
					var coord = trans.PT([pnt.getX(), pnt.getY()]);
					coords.push(coord);
				});
				coords.push(coords[0]);

				var poly = turf.polygon([coords]);

				if(!lyrColorObj.hasOwnProperty(item.ColorValue())) {
					lyrColorObj[item.ColorValue()] = new Array();
				}
				lyrColorObj[item.ColorValue()].push(poly);

			})
			var dissolveLyr = dissolveFeatures(lyrColorObj);

			return dissolveLyr;
		}

		return contourSO2;
	}
};
var ContourBandStyle = {
	createNew: function(color) {
		var bandStyle = {
			stroke: false,
			fill: true,
			fillColor: color,
			fillOpacity: 0.2,
			fillRule: 'evenodd',
			bubblingMouseEvents: false,
			smoothFactor: 1
		};
		return bandStyle;
	}
};