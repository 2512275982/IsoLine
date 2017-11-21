var PointInfoClass = {
	createNew:function(lon,lat,eValue){
		var pointInfo = {};
		var x = lon;
		var y = lat;
		var value = eValue;
		pointInfo.X = function(){
			return x;
		};
		pointInfo.Y = function(){
			return y;
		};
		pointInfo.Value = function(){
			return value;
		}
		pointInfo.Equals = function(pntOther){
			if(pntOther instanceof PointInfoClass){
				return pntOther.X === pointInfo.X && pntOther.Y === pointInfo.Y;
			}
		};
		return pointInfo;
	}
};
/*
 * 目前只支持简单多边形，不支持多环多边形
 */
var PolygonInfoClass = {
	createNew:function(value){
		var polygonInfo = {};
		var colorValue = value;
		var listPolygonVertrix = new Array();
		polygonInfo.ColorValue = function(){
			return colorValue;
		};
		polygonInfo.ListPolygonVertrix = function(){
			return listPolygonVertrix;
		};
		polygonInfo.AddPoint= function(pnt){  
			if(pnt instanceof PointInfoClass){
				listPolygonVertrix.push(pnt);
			}
		};
		return polygonInfo;
	}
	
};
