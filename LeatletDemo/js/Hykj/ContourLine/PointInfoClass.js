/*
 * 定义使用点对象类，并定义一个公共函数，用于判断点位置是否一致
 * Javascript规定，每一个构造函数都有一个prototype属性，指向另一个对象。
 */
function PointInfo(lon,lat,eValue,edgeFlag){
	this.X = lon;
	this.Y = lat;
	this.Z = eValue;
	this.IsEdge = edgeFlag;
}

PointInfo.prototype = {
	constructor : PointInfo,
	Equals : function(pntOther){
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
 * 定义等值线对象类，并定义一个公共函数，用于给等值线添加点
 * 初始化参数type：等值线类型，开放型或闭合型，true表示开放型，false表示闭合型
 * 后续需要修改成枚举的形式，方便使用
 */
function IsolineInfo(value){
	this.ListVertrix = new Array();   //等值线节点集合
	this.LineType = false;  //标识等值线类型，开放或闭合
	this.FinishState = false;   //等值线是否完成追踪 
	this.LineValue = value;  //等值线值
	this.Label = undefined;
}

IsolineInfo.prototype = {
	constructor : IsolineInfo,
	AddPointInfo : function(pntInfo,index){
		if(index === 0){
			this.ListVertrix.unshift(pntInfo);
		}
		else{
			this.ListVertrix.push(pntInfo);
		}
	},
	GetLineFrom : function(){
		return this.ListVertrix[0];
	},
	GetLineEnd : function(){
		return this.ListVertrix[this.ListVertrix.length-1];
	}
}

/*
 * 等值线标注信息
 * 2017.11.26
 */
function LabelInfo(labelPnt,labelAngle,value){
	this.LabelPnt = labelPnt;
	this.LabelAngle = labelAngle;
	this.Value = value;
}

function EdgeInfo(pntA,pntB){
	this.EdgeID = guid();
	this.PointA = pntA;
	this.PointB = pntB;
	this.Triangle1ID = '';
	this.Triangle2ID = '';
}

EdgeInfo.prototype = {
	constructor : EdgeInfo,
	Equals : function(edgeCompare){
		if (edgeCompare instanceof EdgeInfo)
        {
            if (edgeCompare.PointA.Equals(this.PointA) && edgeCompare.PointB.Equals(this.PointB))
                return true;
            else if (edgeCompare.PointB.Equals(this.PointA) && edgeCompare.PointA.Equals(this.PointB))
                return true;
            else
                return false;
        }
        else return false;
	}
}

/*
 * 定义三角形对象类，三角形由A、B和C三个顶点组成
 * 初始化参数pntA,pntB,pntC都是PointInfo对象
 * 作者：maxiaoling
 * 创建时间：2017.11.25
 */
function TriangleInfo(pntA,pntB,pntC){
	this.VertexA = pntA;
	this.VertexB = pntB;
	this.VertexC = pntC;
	this.UseState = false;
	this.TriangleID = guid();
	this.Edge1ID = '';
	this.Edge2ID = '';
	this.Edge3ID = '';
}

TriangleInfo.prototype = {
	constructor : TriangleInfo,
	//判断点是否在三角形外接圆内
    //返回值为int型，0表示包含，1表示点在外接圆的右侧，2表示在外接圆的左侧
	JudgePntInCircleOutside : function(pnt){
		var circumCirleCenterX = ((this.VertexA.Y - this.VertexC.Y) * 
		(this.VertexA.Y * this.VertexA.Y - this.VertexB.Y * this.VertexB.Y + this.VertexA.X * this.VertexA.X - this.VertexB.X * this.VertexB.X)
		- (this.VertexA.Y - this.VertexB.Y) * 
		(this.VertexA.Y * this.VertexA.Y - this.VertexC.Y * this.VertexC.Y + this.VertexA.X * this.VertexA.X - this.VertexC.X * this.VertexC.X)) 
		/ (2 * (this.VertexA.X - this.VertexB.X) * (this.VertexA.Y - this.VertexC.Y) - 2 * ((this.VertexA.X - this.VertexC.X) * (this.VertexA.Y - this.VertexB.Y)));
        var circumCirleCenterY = ((this.VertexA.X - this.VertexC.X) * (this.VertexA.Y * this.VertexA.Y - this.VertexB.Y * this.VertexB.Y + this.VertexA.X * this.VertexA.X - this.VertexB.X * this.VertexB.X) - (this.VertexA.X - this.VertexB.X) * (this.VertexA.Y * this.VertexA.Y - this.VertexC.Y * this.VertexC.Y + this.VertexA.X * this.VertexA.X - this.VertexC.X * this.VertexC.X)) / (2 * (this.VertexA.X - this.VertexC.X) * (this.VertexA.Y - this.VertexB.Y) - 2 * ((this.VertexA.X - this.VertexB.X) * (this.VertexA.Y - this.VertexC.Y)));
		var circumCirleRadius2 = Math.pow(circumCirleCenterX - this.VertexA.X, 2) + Math.pow(circumCirleCenterY - this.VertexA.Y, 2);
		var dist2 = Math.pow(pnt.X - circumCirleCenterX, 2) + Math.pow(pnt.Y - circumCirleCenterY, 2);
        //在外接圆内部返回真，否则返回假
        
        alert(pnt.X+"  "+pnt.Y+"  "+dist2);
        if (dist2 <= circumCirleRadius2)
        {
            return 0;
        } 
        else
        {
            if (pnt.X > circumCirleCenterX + Math.sqrt(circumCirleRadius2))
                return 1;
            else return 2;
        }
	},
	JudgePntIsVertex : function(pnt){
		if (this.VertexA.X == pnt.X && this.VertexA.Y == pnt.Y)
            return true;
        else if (this.VertexB.X == pnt.X && this.VertexB.Y == pnt.Y)
            return true;
        else if (this.VertexC.X == pnt.X && this.VertexC.Y == pnt.Y)
            return true;
        return false;
	},
	ResetState : function(){
		this.UseState = false;
	}
}

/*
 * 生成GUID方法
 */
function guid() {  
    function S4() {  
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
    }  
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());  
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
