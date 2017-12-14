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

/*
 * 简单多边形，组成multiPolygon的单元
 * vertries：点数组，[[x1,y1],[x2,y2],[x3,y3],...]
 * 参考了openlayers和leaflet的多边形定义，点数组不闭合，也就是起点和终点不是同一个点
 * edit by maxiaoling 2017.12.13
 */
function IsoRing(vertries){
	this.vertries = vertries;
}
IsoRing.prototype = {
	constructor : IsoRing,
	//在多边形的末尾加上一个点,(pnt)格式为[x,y]
	PushPoint : function(pnt){
		this.listPolygonVertrix.push(pnt);
	},
	//在多边形的开头加上一个点,(pnt)格式为[x,y]
	UnshiftPoint : function(pnt){
		this.listPolygonVertrix.unshift(pntInfo);
	},
	//参数对象可以是一个，可以是两个。一个时传PointInfo对象，两个时传[x,y]坐标值
	JudgePntInRing : function(){ 
		 count = this.vertries.length;
		if(count < 3){
			return false;
		}
		var p1,p2,dx;
		var x1,y1,x2,y2,x,y;
		var pSum = 0;
		if(arguments.length == 1){
			x = arguments[0].X,y = arguments[0].Y;
		}
		else if(arguments.length == 2){
			x = arguments[0],y = arguments[1];
		}
		for(var i = 0;i<this.vertries.length;i++){
			p1 = this.vertries[i];
			x1 = p1[0],y1 = p1[1];
			p2 = this.vertries[i+1];
			x2 = p2[0],y2 = p2[1];
			if(((y >= y1) && (y < y2)) || ((y >= y2)&&(y < y1))){
				if(Math.abs(y1 - y2)>0){
					dx = x1 - ((x1 - x2)*(y1-y))/(y1-y2);
					if(dx<pnt.x){
						pSum++;
					}
				}
			}
		}
		if((pSum%2)!=0){
			return true;
		}
		return false;
	}
}

function IsoRingInfo(isoRing,value){
	this.isoRing = isoRing;
	this.id = id;
	this.value = value;
	this.ringParent = undefined;
	this.ringChidren = new Array();
}
IsoRingInfo.prototype = {
	constructor : IsoRingInfo,
	AddChild : function(childRingId){
		this.ringChidren.push(childRingId);
	},
	SetParent : function(parentRingId){
		this.ringParent = parentRingId;
	}
}

var JudgePntInPolygon = function(pnt,polyPnts){
			var count = polyPnts.length;
			if(count < 4){
				return false;
			}
			var p1,p2,dx;
			var pSum = 0;
			for(var i = 0;i<polyPnts.length;i++){
				p1 = polyPnts[i];
				p2 = polyPnts[i+1];
				if(((pnt.Y >= p1.Y) && (pnt.Y < p2.Y)) || ((pnt.Y >= p2.Y)&&(pnt.Y<p1.Y))){
					if(Math.abs(p1.Y - p2.Y)>0){
						dx = p1.X - ((p1.X - p2.X)*(p1.Y-p.Y))/(p1.Y-p2.Y);
						if(dx<pnt.x){
							pSum++;
						}
					}
				}
			}
			if((pSum%2)!=0){
				return true;
			}
			return false;
		}

/*
 * 多边形，支持multiPolygon，由IsoRing组成
 * outerRings:外围多边形IsoRing数组，可由一个或多个组成（暂时未想到必须多个的情况）
 * interRings:内部镂空多边形IsoRing数组，可由一个或多个组成
 */
function IsoPolygonInfo(outerRings,interRings) {
	if(arguments.length == 1){
		this.outerRings = outerRings;
		this.interRings = new Array();
	}
	else if(arguments.length == 2){
		this.outerRings = outerRings;
		this.interRings = interRings;
	}
	this.minValue = undefined;
	this.maxValue = undefined;
}
IsoPolygonInfo.prototype = {
	constructor : IsoPolygonInfo,
	AddInterRing : function(isoRing){
		this.interRings.push(isoRing);
	}
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
