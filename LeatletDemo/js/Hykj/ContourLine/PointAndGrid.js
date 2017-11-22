/*
 * 定义原始点数据
 * isEdge--暂时未使用
 */
function Point(x, y, z, isEdge) {
	this.x = x;
	this.y = y;
	this.z = z;
};

/*
 * 定义每一个网格点
 */
function Grid(Points) {

	this.Points = Points; //单元网格的四个顶点
	this.gridType = 0; //单元网格存值点的存在类型0,1,2,3,5,6......15
	this.contourVal = 0; //所追踪的等值线的值
	this.pURDL = new Array(); //计算四条边上的等值点
	this.isTraveled = false; //网格是否被访问过，默认为false 
	this.trendType = 0; //等值线的进入方向

	this.init = function(contourVal) {
		this.gridType = 0;
		this.trendType = 0;
		this.contourVal = contourVal;
		this.pURDL = new Array();
		this.isTraveled = false;
		analyzeGridByContourVal.call(this, this.Points, this.contourVal);
	};
}

/*
 * 根据网格点和追踪等值线的数值填充网格
 * 从左上角顺时针旋转
 */
function analyzeGridByContourVal(ptArr, contourVal) {
	var str = "";
	for(var i = 0; i < ptArr.length; i++) {
		var z = ptArr[i].Z;
		if(z > contourVal) {
			str += "1";
		} else {
			str += "0";
		}
	}
	this.gridType = parseInt(str, 2);
	//从中间开始，顺时针旋转
	var trendPts = [undefined, undefined, undefined, undefined];
	switch(this.gridType) {
		case 0:
		case 15:
			break;
		case 1:
		case 14:
			trendPts[2] = calcumThroughPT(ptArr[3], ptArr[2], contourVal);
			trendPts[3] = calcumThroughPT(ptArr[3], ptArr[0], contourVal);
			break;
		case 2:
		case 13:
			trendPts[1] = calcumThroughPT(ptArr[2], ptArr[1], contourVal);
			trendPts[2] = calcumThroughPT(ptArr[3], ptArr[2], contourVal);
			break;
		case 3:
		case 12:
			trendPts[1] = calcumThroughPT(ptArr[2], ptArr[1], contourVal);
			trendPts[3] = calcumThroughPT(ptArr[3], ptArr[0], contourVal);
			break;
		case 4:
		case 11:
			trendPts[0] = calcumThroughPT(ptArr[0], ptArr[1], contourVal);
			trendPts[1] = calcumThroughPT(ptArr[2], ptArr[1], contourVal);
			break;
		case 5:
			trendPts[0] = calcumThroughPT(ptArr[0], ptArr[1], contourVal);
			trendPts[1] = calcumThroughPT(ptArr[2], ptArr[1], contourVal);
			trendPts[2] = calcumThroughPT(ptArr[3], ptArr[2], contourVal);
			trendPts[3] = calcumThroughPT(ptArr[3], ptArr[0], contourVal);
			break;
		case 6:
		case 9:
			trendPts[0] = calcumThroughPT(ptArr[0], ptArr[1], contourVal);
			trendPts[2] = calcumThroughPT(ptArr[3], ptArr[2], contourVal);
			break;
		case 7:
		case 8:
			trendPts[0] = calcumThroughPT(ptArr[0], ptArr[1], contourVal);
			trendPts[3] = calcumThroughPT(ptArr[3], ptArr[0], contourVal);
			break;
		case 10:
			trendPts[0] = calcumThroughPT(ptArr[0], ptArr[1], contourVal);
			trendPts[1] = calcumThroughPT(ptArr[2], ptArr[1], contourVal);
			trendPts[2] = calcumThroughPT(ptArr[3], ptArr[2], contourVal);
			trendPts[3] = calcumThroughPT(ptArr[3], ptArr[0], contourVal);
			break;
		default:
			break;
	}
	this.pURDL = trendPts;
}
//传入顺序必须从小到大
function calcumThroughPT(ptA, ptB, contourVal) {
	var subtractValue = Math.abs(ptA.Z - ptB.Z);
	var x, y, isEdge;
	if(ptA.x == ptB.X) { //y方向
		x = ptA.X;
		y = ptA.X + (Math.abs(contourVal - ptA.Z) / subtractValue) * (ptB.Y - ptA.Y);

	} else { //x方向
		y = ptA.Y;
		x = ptA.X + (Math.abs(contourVal - ptA.Z) / subtractValue) * (ptB.X - ptA.X);

	}

	return new Point(x, y, contourVal, ptA.isEdge && ptB.isEdge)
}