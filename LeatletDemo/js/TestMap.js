/*
 * 测试等值线生成程序
 */
var map;
var airData;
var contourLine;
var splitValues,splitColors,type;

var initMap = function() {
	map = L.map('map', {
		fullscreenControl: {
			pseudoFullscreen: false
		}
	}).setView([31.59, 120.29], 7);

	var layers = [];
	for(var providerId in providers) {
		layers.push(providers[providerId]);
	}
	var ctrl = L.control.iconLayers(layers).addTo(map);
	L.Control.boxzoom({ position: 'topleft' }).addTo(map);
	L.control.defaultExtent().addTo(map);

	$.getJSON("./js/Hykj/ContourLine/test.json", function(data) {
		airData = data;
	});
	contourLine = ContourLine.createNew();
	//		getDataFromJson();
};

//展示等值线
var showSO2 = function() {
	splitValues = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750];
	splitColors = ["#73BF00","#82D900","#8CEA00","#9AFF02","#A8FF24","#CCFF80","#FFFFB9","#FFFFAA","#FFFF6F","#FF8F59","#FF5809","#D94600","#A23400","#642100","#600000","#2F0000"];
	type = "SO2";
//	showIsolines("SO2", splitValues);
}

var showNO2 = function() {
	splitValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270];
	splitColors = ["#73BF00","#82D900","#8CEA00","#9AFF02","#A8FF24","#B7FF4A","#C2FF68","#CCFF80","#D3FF93","#FFFFB9","#FFFFAA","#FFFF93","#FFFF6F","#FFAD86","#FF9D6F","#FF8F59","#FF8040","#FF5809","#F75000","#D94600","#BB3D00","#A23400","#842B00","#642100","#750000","#600000","#4D0000","#2F0000"];
	type = "NO2";
//	showIsolines("NO2", splitValues);
}

var showCO = function() {
	splitValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	splitColors = ["#73BF00","#82D900","#9AFF02","#A8FF24","#C2FF68","#CCFF80","#FF5809","#D94600","#A23400","#842B00","#750000","#600000","#2F0000"];
	type = "CO";
//	showIsolines("CO", splitValues);
}

var showO3 = function() {
	splitValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240];
	splitColors = ["#73BF00","#82D900","#8CEA00","#9AFF02","#A8FF24","#B7FF4A","#C2FF68","#CCFF80","#D3FF93","#FFFFAA","#FFFF93","#FFFF6F","#FF9D6F","#FF5809","#F75000","#BB3D00","#A23400","#842B00","#642100","#750000","#600000","#4D0000","#2F0000"];
	type = "O3";
//	showIsolines("O3", splitValues);
}

var showPM25 = function() {
	splitValues = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105];
	splitColors = ["#73BF00","#82D900","#8CEA00","#9AFF02","#A8FF24","#B7FF4A","#C2FF68","#CCFF80","#FFFFB9","#FFFF93","#FFAD86","#FF8F59","#FF5809","#D94600","#BB3D00","#A23400","#842B00","#642100","#750000","#600000","#4D0000","#2F0000"];
	type = "pm25";
//	showIsolines("PM25", splitValues);
}
var showPM10 = function() {
	splitValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260];
	splitColors = ["#73BF00","#82D900","#8CEA00","#9AFF02","#A8FF24","#B7FF4A","#C2FF68","#CCFF80","#D3FF93","#FFFFB9","#FFFFAA","#FFFF93","#FFFF6F","#FFAD86","#FF9D6F","#FF8F59","#FF5809","#F75000","#D94600","#BB3D00","#A23400","842B00","642100","750000","600000","4D0000","2F0000"];
	type = "pm10";
//	showIsolines("PM10", splitValues);
}

var showIsolines = function(dataType, splitValues) {
	var listData = gridOrignPnts(airData, dataType);
	var interpolateFeatures = contourLine.IsoLineLayer(listData, splitValues);
	interpolateFeatures.addTo(map);
};

var showIsobands = function(dataType, splitValues, splitColors) {
	var listData = gridOrignPnts(airData, dataType);
	var interpolateFeatures = contourLine.BandLayer(listData, splitValues, splitColors);
	interpolateFeatures.addTo(map);
};

var showIsoPnts = function(dataType, splitValues, splitColors) {
	var listData = gridOrignPnts(airData, dataType);
	var pntLyrs = contourLine.ShowPnt(listData,dataType,splitValues,splitColors);
	pntLyrs.addTo(map);
};

/*
 * 控制显示等值线与色斑图
 */
function DZX() { 
	showIsolines(type,splitValues);
//	if(map.hasLayer(contourLine.getIsolineLyr())) {
//		map.removeLayer(contourLine.getIsolineLyr());
//	} else {
//		map.addLayer(contourLine.getIsolineLyr());
//	}
}

function SBT() {
	showIsobands(type,splitValues,splitColors);
//	if(map.hasLayer(contourLine.getContourBandLyr())) {
//		map.removeLayer(contourLine.getContourBandLyr());
//	} else {
//		map.addLayer(contourLine.getContourBandLyr());
//	}
}

function CYD() {
	showIsoPnts(type,splitValues,splitColors);
//	if(map.hasLayer(contourLine.getPntLayer())) {
//		map.removeLayer(contourLine.getPntLayer());
//	} else {
//		map.addLayer(contourLine.getPntLayer());
//	}
}

/*
 * 初始化网格数据格式，传入的值为经纬度以及Z值的列表
 */
var gridOrignPnts = function(listData, dataType) {
	var listGridOrignPnts = new Array();
	listData.forEach(function(item) {
		var pntClass = new PointInfo(item.longitude, item.latitude, item[dataType]);
		listGridOrignPnts.push(pntClass);
	});
	return listGridOrignPnts;
};

var getDataFromJson = function(dataType) {
	var listData = gridOrignPnts(airData, dataType);
	var pm25Colors = new Array();
	var interpolateFeatures = ContourLine.createNew().BandLayer(listData, pm25Colors);
	interpolateFeatures.addTo(map);
};