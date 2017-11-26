/*
 * Delauney三角网构建模块
 * 作者：maxiaoling
 * 创建日期：2017.11.25
 * 参考算法：http://www.cnblogs.com/zhiyishou/p/4430017.html
 */
var DelauneyClass = {
	createNew: function(listPoints) {
		var delauneyInfo = {};
		alert(listPoints[0].X);
		alert(listPoints[0].Y);
		
		var tempListPntInfo = listPoints;
		var tempListTriangles = new Array();
		var tempListEdgeInfo = new Array();
		var listTriangles = new Array();
		
		var dicEdgeInfo = new Array();
		var listIsoLines = new Array();
		var valTrangles;
		
		/*
		 * 三次B样条曲线
		 * 输入参数isoline：等值折线
		 * 输入参数clipCount：插值点数量
		 */
		var BsLine = function(isoline,clipCount){
			var bsPoints = new Array();
			
			var linePnts = isoline.ListVertrix;
			var x0 = 2.0*linePnts[0].X - linePnts[1].X;
			var y0 = 2.0*linePnts[0].Y - linePnts[1].Y;
			var pnt0 = new PointInfo(x0,y0);
			var xn = 2.0*linePnts[linePnts.length-1].X-linePnts[linePnts.length-2].X;
			var yn = 2.0*linePnts[linePnts.length-1].Y-linePnts[linePnts.length-2].Y;
			var pntn = new PointInfo(xn,yn);
			
			linePnts.unshift(pnt0);  //向数组最前面插入值
			linePnts.push(pntn);    //向数组后面加入值
			
			var A0,A1,A2,A3;
			var B0,B1,B2,B3;
			var dt = 1.0/clipCount;
			for(var i = 0;i<linePnts.length-3;i++){
				A0 = (linePnts[i].X + 4.0 * linePnts[i + 1].X + linePnts[i + 2].X) / 6.0;
				A1 = -(linePnts[i].X - linePnts[i + 2].X) / 2.0;
                A2 = (linePnts[i].X - 2.0 * linePnts[i + 1].X + linePnts[i + 2].X) / 2.0;
                A3 = -(linePnts[i].X - 3.0 * linePnts[i + 1].X + 3.0 * linePnts[i + 2].X - linePnts[i + 3].X) / 6.0;
                B0 = (linePnts[i].Y + 4.0 * linePnts[i + 1].Y + linePnts[i + 2].Y) / 6.0;
                B1 = -(linePnts[i].Y - linePnts[i + 2].Y) / 2.0;
                B2 = (linePnts[i].Y - 2.0 * linePnts[i + 1].Y + linePnts[i + 2].Y) / 2.0;
                B3 = -(linePnts[i].Y - 3.0 * linePnts[i + 1].Y + 3.0 * linePnts[i + 2].Y - linePnts[i + 3].Y) / 6.0;
                
                var t1, t2, t3 = 0;
                for (var j = 0; j < clipCount + 1; j++)
                {
                    t1 = dt * j;
                    t2 = t1 * t1;
                    t3 = t1 * t2;

                    var x = A0 + A1 * t1 + A2 * t2 + A3 * t3;
                    var y = B0 + B1 * t1 + B2 * t2 + B3 * t3;

                    bsPoints.push(new PointInfo(x, y));
                }
			}
			return bsPoints;
		};
		
		var GetDelauney = function(){
			var superTriangle = SuperTriangle(tempListPntInfo);
            tempListTriangles.push(superTriangle);
			var count0=0,count1=0,count2=0;
            for (var i = 0; i < tempListPntInfo.length; i++)
            {
                var pntInfo = tempListPntInfo[i];
                tempListEdgeInfo.splice(0,tempListEdgeInfo.length);
                for (var j = 0; j < tempListTriangles.length; j++)
                {
                    var triangle = tempListTriangles[j];
                    var containType = triangle.JudgePntInCircleOutside(pntInfo);
                    if (containType == 0)  //在外接圆内部
                    {
                        tempListEdgeInfo.push(new EdgeInfo(triangle.VertexA, triangle.VertexB));
                        tempListEdgeInfo.push(new EdgeInfo(triangle.VertexA, triangle.VertexC));
                        tempListEdgeInfo.push(new EdgeInfo(triangle.VertexB, triangle.VertexC));
                        tempListTriangles.splice(j,1);
                        j--;
                        count0++;
                    }
                    else if (containType == 1)  //在外接圆外部右侧
                    {
                        tempListTriangles.splice(j,1);
                        listTriangles.push(triangle);
                        j--;
                        count1++;
                    }
                    else{
                    	count2++;
                    }
                }
                alert(count0 +"  "+count1+"   "+count2);
                for (var ij = 0; ij < tempListEdgeInfo.length; ij++)  //去除临时边列表中的重复边
                {
                    for (var ii = ij + 1; ii < tempListEdgeInfo.length; ii++)
                    {
                        var edgeFirst = tempListEdgeInfo[ij];
                        var edgeRepeat = tempListEdgeInfo[ii];
                        if (edgeFirst.PointA.X === edgeRepeat.PointA.X && edgeFirst.PointA.Y === edgeRepeat.PointA.Y)
                        {
                            if (edgeFirst.PointB.X == edgeRepeat.PointB.X && edgeFirst.PointB.Y == edgeRepeat.PointB.Y)
                            {
                                tempListEdgeInfo.splice(ii,1);
                                ii--;
                            }
                        }
                        else if (edgeFirst.PointB.X == edgeRepeat.PointA.X && edgeFirst.PointB.Y == edgeRepeat.PointA.Y)
                        {
                            if (edgeFirst.PointA.X == edgeRepeat.PointB.X && edgeFirst.PointA.Y == edgeRepeat.PointB.Y)
                            {
                                tempListEdgeInfo.splice(ii,1);
                                ii--;
                            }
                        }
                    }
                }

                for (var index in tempListEdgeInfo)
                {
                	var edgeInfo = tempListEdgeInfo[index];
                    tempListTriangles.push(new TriangleInfo(pntInfo, edgeInfo.PointA, edgeInfo.PointB));
                }
//              alert(tempListTriangles.length);
            }

            listTriangles = listTriangles.concat(tempListTriangles);
            alert(listTriangles.length);

            //去除三角形中
            for (var temp = 0; temp < listTriangles.length; temp++)
            {
                var tri = listTriangles[temp];
                for (var kk = 0; kk < tempListPntInfo.length; kk++)
                {
                    var pnt = tempListPntInfo[kk];
                    if (tri.JudgePntIsVertex(pnt))
                        continue;
                    if (tri.JudgePntInCircleOutside(pnt) == 0)
                    {
                        listTriangles.splice(temp,1);
                        temp--;
                        break;
                    }

                }
            }

            for (var i = 0; i < listTriangles.length; i++)
            {
                var trigleInfo = listTriangles[i];
                if (trigleInfo.JudgePntIsVertex(superTriangle.VertexA))
                {
                    listTriangles.splice(i,1);
                    i--;
                    continue;
                }
                else if (trigleInfo.JudgePntIsVertex(superTriangle.VertexB))
                {
                    listTriangles.splice(i,1);
                    i--;
                    continue;
                }
                else if (trigleInfo.JudgePntIsVertex(superTriangle.VertexC))
                {
                    listTriangles.splice(i,1);
                    i--;
                    continue;
                }
            }
		};

		var SuperTriangle = function(vertices){
			
			var xmin = Number.POSITIVE_INFINITY,
	        ymin = Number.POSITIVE_INFINITY,
	        xmax = Number.NEGATIVE_INFINITY,
	        ymax = Number.NEGATIVE_INFINITY,
	        i, dx, dy, dmax, xmid, ymid;
	
		    for(i = vertices.length; i--; ) {
		      if(vertices[i].X < xmin) xmin = vertices[i].X/1;
		      if(vertices[i].X > xmax) xmax = vertices[i].X/1;
		      if(vertices[i].Y < ymin) ymin = vertices[i].Y/1;
		      if(vertices[i].Y > ymax) ymax = vertices[i].Y/1;
		    }
		    
		    ymin = 31.5039;
            ymax = 36.5036;
            xmin = 110.3972;
            xmax = 116.5833;
		    
		    var d = (ymax - ymin) / 10;
		    		
			var pntA = new PointInfo(xmin + (xmax - xmin) / 2, 2 * ymax - ymin);
			var pntB = new PointInfo(xmin - d - (xmax - xmin) / 2, ymin - d);
			var pntC = new PointInfo(xmax + d + (xmax - xmin) / 2, ymin - d);
			var superTriangle = new TriangleInfo(pntA,pntB,pntC);
			return superTriangle;
		};
		
		delauneyInfo.Isoline = function(values){
			GetDelauney();
			UnitDicEdges();
            for (var lineIndex = 0; lineIndex < values.length; lineIndex++)
            {
                var value = values[lineIndex];
                valTrangles = GetListTrangles(value);
                if (valTrangles.length > 0)
                {
                    var edgeStart = undefined;
                    var triangleStart = undefined;
                    var listContourPnts = new Array();

                    for (var itemKey in valTrangles)  //开放式等值线查找
                    {
                        triangleStart = valTrangles[itemKey];


                        if (triangleStart.UseState == 1)  //已经参与过的三角形不做重复查找
                            continue;
                        edgeStart = GetOneTriangleEdgeInfo(triangleStart, value);
                        if (edgeStart == null)  //起始边
                            continue;
                        listContourPnts.splice(0,listContourPnts.length);
                        listContourPnts.push(GetPnt(edgeStart, value));

                        while (true)
                        {
                            edgeStart = GetAnotherValue(triangleStart, value, edgeStart.EdgeID);
                            var pntAnother = GetPnt(edgeStart, value);
                            listContourPnts.push(pntAnother);
                            triangleStart.UseState = -1;

                            var endTrianleId = '';
                            if (!(edgeStart.Triangle1ID == triangleStart.TriangleID))
                            {
                                endTrianleId = edgeStart.Triangle1ID;
                            }
                            else
                            {
                                endTrianleId = edgeStart.Triangle2ID;
                            }

                            if (endTrianleId == '')  //边界
                            {
                                var isoLine = new IsolineInfo(value);
                                isoLine.ListVertrix = BsLine(listContourPnts);
                                listIsoLines.push(isoLine);
                                //将三角形状态置为1
                                UpdataTriangleState(1);
                                break;
                            }
                            if (valTrangles[endTrianleId]!==undefined)
                            {
                                triangleStart = valTrangles[endTrianleId];
                                if (triangleStart.UseState == 1)  //三角形已经用过，终止查找
                                {
                                    //将三角形状态置为0
                                    UpdataTriangleState(0);
                                    break;
                                }
                                if (triangleStart.UseState == -1)  //三角形已经在该等值线中，在开环的情况下该情况不存在
                                {
                                    //将三角形状态置为0
                                    UpdataTriangleState(0);
                                    break;
                                }
                            }
                            else
                            {
                                //将三角形状态置为0
                                UpdataTriangleState(0);
                                break;
                            }                               
                        }
                    }

                    for (var itemKey in valTrangles)  //闭合式等值线查找
                    {
                        triangleStart = valTrangles[itemKey];
                        if (triangleStart.UseState == 1)  //已经参与过的三角形不做重复查找
                            continue;

                        listContourPnts.splice(0,listContourPnts.length);
                        edgeStart = GetStartEdgeInfo(triangleStart, value);
                        listContourPnts.push(GetPnt(edgeStart, value));

                        while (true)
                        {
                            edgeStart = GetAnotherValue(triangleStart, value, edgeStart.EdgeID);
                            var pntAnother = GetPnt(edgeStart, value);
                            listContourPnts.push(pntAnother);
                            triangleStart.UseState = -1;

                            var endTrianleId = '';
                            if (!(edgeStart.Triangle1ID == triangleStart.TriangleID))
                            {
                                endTrianleId = edgeStart.Triangle1ID;
                            }
                            else
                            {
                                endTrianleId = edgeStart.Triangle2ID;
                            }

                            if (endTrianleId == '')  //边界
                            {
                                //将三角形状态置为1
                                UpdataTriangleState(0);
                                break;
                            }

                            if (valTrangles[endTrianleId] != undefined)
                            {
                                triangleStart = valTrangles[endTrianleId];
                                if (triangleStart.UseState == 1)  //三角形已经用过，终止查找
                                {
                                    //将三角形状态置为0
                                    UpdataTriangleState(0);
                                    break;
                                }
                                if (triangleStart.UseState == -1)
                                {
                                    if (listContourPnts[0].X == listContourPnts[listContourPnts.Count - 1].X && listContourPnts[0].Y == listContourPnts[listContourPnts.Count - 1].Y)
                                    {
                                        var isoLine = new IsolineInfo(value);
                                        isoLine.ListVertrix = BsLine(listContourPnts);//DrawParaCurveLine(
                                        listIsoLines.push(isoLine);
                                        //将三角形状态置为1
                                        UpdataTriangleState(1);
                                    }
                                    else
                                    {
                                        UpdataTriangleState(0);
                                    }

                                    break;
                                }
                            }
                            else
                            {
                                //将三角形状态置为0
                                UpdataTriangleState(0);
                                break;
                            }
                        }
                    }
                }
            }
		};
		
		var UpdataTriangleState = function(state){
			for (var item in valTrangles)  //闭合式等值线查找
            {
                var triangle = valTrangles[item];
                if (triangle.UseState == -1)
                {
                    triangle.UseState = state;
                }
            }
		}
		
		//取三角形另一个经过点
		var GetAnotherValue = function(triangle, value, edgeId){
			if (!triangle.Edge1ID == edgeId)
            {
                var edge1 = dicEdgeInfo[triangle.Edge1ID];
                if (JudgeValueOnEdge(edge1, value))
                {
                    return edge1;
                }
            }

            if (!triangle.Edge2ID == edgeId)
            {
                var edge2 = dicEdgeInfo[triangle.Edge2ID];
                if (JudgeValueOnEdge(edge2, value))
                {
                    return edge2;
                }
            }
            if (!triangle.Edge3ID == edgeId)
            {
                var edge3 = dicEdgeInfo[triangle.Edge3ID];
                if (JudgeValueOnEdge(edge3, value))
                {
                    return edge3;
                }
            }
            return null;
		};
		
		//查找普通三角形边起点
		var GetStartEdgeInfo = function(triangle, value){
			var edge1 = dicEdgeInfo[triangle.Edge1ID];
            if (JudgeValueOnEdge(edge1, value))
            {
                return edge1;
            }
            var edge2 = dicEdgeInfo[triangle.Edge2ID];
            if (JudgeValueOnEdge(edge2, value))
            {
                return edge2;
            }
            var edge3 = dicEdgeInfo[triangle.Edge3ID];
            if (JudgeValueOnEdge(edge3, value))
            {
                return edge3;
            }
            return null;
		};
		
		//查找边界边起点
		var GetOneTriangleEdgeInfo = function(triangle,value){
			var edge1 = dicEdgeInfo[triangle.Edge1ID];
            if (edge1.Triangle2ID == '' && JudgeValueOnEdge(edge1, value))
            {
                return edge1;
            }
            var edge2 = dicEdgeInfo[triangle.Edge2ID];
            if (edge2.Triangle2ID == '' && JudgeValueOnEdge(edge2, value))
            {
                return edge2;
            }
            var edge3 = dicEdgeInfo[triangle.Edge3ID];
            if (edge3.Triangle2ID == '' && JudgeValueOnEdge(edge3, value))
            {
                return edge3;
            }
            return null;
		};
		
		var GetListTrangles = function(value){
			var valTrangles = new Array();
            for (var i = 0; i < listTriangles.length; i++)
            {
                var triangleInfo = listTriangles[i];
                triangleInfo.ResetState();

                var edge1 = dicEdgeInfo[triangleInfo.Edge1ID];
                var edge2 = dicEdgeInfo[triangleInfo.Edge2ID];
                var edge3 = dicEdgeInfo[triangleInfo.Edge3ID];

                var count = 0;
                if (JudgeValueOnEdge(edge1, value))
                {
                    count++;
                }
                if (JudgeValueOnEdge(edge2, value))
                {
                    count++;
                }
                if (JudgeValueOnEdge(edge3, value))
                {
                    count++;
                }
                if (count >= 2)
                {
                    valTrangles[triangleInfo.TriangleID] = triangleInfo;
                }
            }
            return valTrangles;
		};
		
		var SetTriangleEdge = function(triangle,edgeId){
			if(triangle.Edge1ID == ''){
				triangle.Edge1ID = edgeId;
			}
			else if(triangle.Edge2ID == ''){
				triangle.Edge2ID = edgeId;	
			}
			else if(triangle.Edge3ID == ''){
				triangle.Edge3ID = edgeId;
			}
		};
		
		var JudgeValueOnEdge = function(edge,value){
			var tolerance = 0.001;
            var value1 = edge.PointA.EValue, value2 = edge.PointB.EValue;
            if (value1 == value2 && value1 == value)
            {
                value1 += tolerance;
                value2 -= tolerance;
            }
            else if (value1 == value)
            {
                value1 -= tolerance;
            }
            else if (value2 == value)
            {
                value2 -= tolerance;
            }

            return (value1 - value) * (value2 - value) <= 0;
		};
		
		//计算目标点位置
		var GetPnt = function(edge,value){
			var tolerance = 0.001;
            var value1 = edge.PointA.Z, value2 = edge.PointB.Z;
            if (value1 == value2 && value1 == value)
            {
                value1 += tolerance;
                value2 -= tolerance;
            }
            else if (value1 == value)
            {
                value1 -= tolerance;
            }
            else if (value2 == value)
            {
                value2 -= tolerance;
            }
            var factor = (value - value1) / (value2 - value1);
            var x = edge.PointA.X + factor * (edge.PointB.X - edge.PointA.X);
            var y = edge.PointA.Y + factor * (edge.PointB.Y - edge.PointA.Y);

            return new PointInfo(x, y);
		};
		
		//初始化边列表，整理三角形和边的关联关系
		var UnitDicEdges = function(){
			for (var i = 0; i < listTriangles.length; i++)
            {
                var triangle = listTriangles[i];
                var edgeAB = new EdgeInfo(triangle.VertexA, triangle.VertexB);
                var edgeAC = new EdgeInfo(triangle.VertexA, triangle.VertexC);
                var edgeBC = new EdgeInfo(triangle.VertexB, triangle.VertexC);

                var isABin = false, isACin = false, isBCin = false;
                if (dicEdgeInfo.length > 0)
                {
                    for (var item in dicEdgeInfo)
                    {
                        if (edgeAB.Equals(dicEdgeInfo[item]))
                        {
                            dicEdgeInfo[item].Triangle2ID = triangle.TriangleID;
                            SetTriangleEdge(triangle, dicEdgeInfo[item]);
                            isABin = true;
                        }
                        if (edgeAC.Equals(dicEdgeInfo[item]))
                        {
                            dicEdgeInfo[item].Triangle2ID = triangle.TriangleID;
                            SetTriangleEdge(triangle, dicEdgeInfo[item]);
                            isACin = true;
                        }
                        if (edgeBC.Equals(dicEdgeInfo[item]))
                        {
                            dicEdgeInfo[item].Triangle2ID = triangle.TriangleID;
                            SetTriangleEdge(triangle, dicEdgeInfo[item]);
                            isBCin = true;
                        }
                    }
                }
                if (!isABin)
                {
                    edgeAB.Triangle1ID = triangle.TriangleID;
                    SetTriangleEdge(triangle, edgeAB.EdgeID);
                    dicEdgeInfo[edgeAB.EdgeID] = edgeAB;
                }
                if (!isACin)
                {
                    edgeAC.Triangle1ID = triangle.TriangleID;
                    SetTriangleEdge(triangle, edgeAC.EdgeID);
                    dicEdgeInfo[edgeAC.EdgeID] = edgeAC;
                }
                if (!isBCin)
                {
                    edgeBC.Triangle1ID = triangle.TriangleID;
                    SetTriangleEdge(triangle, edgeBC.EdgeID);
                    dicEdgeInfo[edgeBC.EdgeID] = edgeBC;
                }
            }
		};

		return delauneyInfo;
	}
}