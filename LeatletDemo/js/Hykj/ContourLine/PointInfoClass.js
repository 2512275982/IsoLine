/*
 * 定义使用点对象，并定义一个公共函数，用于判断点位置是否一致
 * Javascript规定，每一个构造函数都有一个prototype属性，指向另一个对象。
 */
var count =0;

function PointInfo(lon,lat,eValue,edgeFlag){
	this.X = lon;
	this.Y = lat;
	this.Z = eValue;
	this.IsEdge = edgeFlag;
	this.Equals = function(pntOther){
		if(pntOther instanceof PointInfo){
			if(Math.abs(pntOther.X - this.X) < 0.000001 && Math.abs(pntOther.Y - this.Y) <0.000001){
				return true;
			}
			else{
				return false;
			}

		}
	}
}

/*
 * 定义等值线对象，并定义一个公共函数，用于给等值线添加点
 * 初始化参数type：等值线类型，开放型或闭合型，true表示开放型，false表示闭合型
 * 后续需要修改成枚举的形式，方便使用
 */
function IsolineInfo(){
	this.ListVertrix = new Array();   //等值线节点集合
	this.LineType = false;  //标识等值线类型，开放或闭合
	this.FinishState = false;   //等值线是否完成追踪 
	this.AddPointInfo = function(pntInfo,index){
		if(index === 0){
			this.ListVertrix.unshift(pntInfo);
		}
		else{
			this.ListVertrix.push(pntInfo);
		}
	}
	this.GetLineFrom = function(){
		return this.ListVertrix[0];
	}
	this.GetLineEnd = function(){
		return this.ListVertrix[this.ListVertrix.length-1];
	}
}

/*
 * 目前只支持简单多边形，不支持多环多边形
 */
var PolygonInfoClass = {
	createNew:function(value){
		var polygonInfo = {};
		var colorValue = value;
		polygonInfo.Color = value;
		var listPolygonVertrix = new Array();
		polygonInfo.ColorValue = function(){
			return colorValue;
		};
		polygonInfo.ListPolygonVertrix = function(){
			return listPolygonVertrix;
		};
		polygonInfo.AddPoint= function(pnt){  
			//if(pnt instanceof PointInfoClass){
				listPolygonVertrix.push(pnt);
			//}
		};
		return polygonInfo;
	}
	
};
