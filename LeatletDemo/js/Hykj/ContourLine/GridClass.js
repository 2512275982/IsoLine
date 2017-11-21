var GridClass = {
	createNew:function(listPoints){
		var gridsInfo = {};
		var listOriginPnts = listPoints;
		var listPolygons = new Array(); 
		var gridStep = 100;
		var pntGrid = new Array();
		
		/*
		 * 根据原始的点数据，插值构造网格矩阵
		 * 网格数默认为100，可以调参数，网格数越多步数越小，生成的等值线越平滑
		 */
		var GetGrids = function(){
			var yMax = -1, yMin = -1, xMax = -1, xMin = -1;
			if(listOriginPnts.length > 0){
				yMin = yMax = listOriginPnts[0].Y;
                xMin = xMax = listOriginPnts[0].X;
			}
			listOriginPnts.forEach(function(tempPnt){
				if (tempPnt.Y < yMin)
                {
                    yMin = tempPnt.Y;
                }
                else if (tempPnt.Y > yMax)
                {
                    yMax = tempPnt.Y;
                }

                if (tempPnt.X < xMin)
                {
                    xMin = tempPnt.X;
                }
                else if(tempPnt.X > xMax)
                {
                    xMax = tempPnt.X;
                }
			})
			
			var dx = xMax - xMin;
            var dy = yMax - yMin;
            var step = 0;
            if (dx > dy)
            {
                step = dx / (gridStep-1);
            }
            else
            {
                step = dy / (gridStep-1);
            }
            
            var iLength = dx / step + 1;
            var jLength = dy / step + 1;
            pntGrid.splice(0,pntGrid.length);
            for (var i = 0; i <= dx / step; i++)
            {
                var gridArray = new Array;
                var x = xMin + i * step;
                for (var j = 0; j <= dy / step; j++)
                {
                    var y = yMin + j * step;

                    var value = GetGridPntValue(x, y);

                    PointInfoClass pnt = PointInfoClass.createNew(x, y, value);
                    gridArray.push(pnt);
                }
                pntGrid.push(gridArray);
            }
		};
		
		/*
		 * 插值取网格值，返回网格值
		 */
		var GetGridPntValue = function(lon,lat){
			var valueSum = 0;
			var disSum = 0;
			listOriginPnts.forEach(function(item){
				var dis2 = (item.X - x) * (item.X - x) + (item.Y - y) * (item.Y - y);
				disSum += 1/dis2;
				valueSum += 1/dis2*item.Value;
			})
			var gridValue = valueSum/disSum;
			return gridValue;
		};
		/*
		 * 判断值是否在渲染范围内，小于最小值返回0，在范围内返回1，大于最大值返回2
		 * 比如渲染区域为90-100，则小于90返回0，在90-100范围内返回1，大于100返回2
		 */
		var GetTypValue = function(value,minValue,maxValue){
			var type = -1;
			if (value < minValue)
            {
                type = 0;
            }
            else if (value >= minValue && value <= maxValue)
            {
                type = 1;
            }
            else if (value > maxValue)
            {
                type = 2;
            }
            return type;
		};
		
		/*
		 * 画等高带，画一个区间的等高带，需要多个区间循环即可
		 */
		var GetContourBand = function(minValue,maxValue){
			for(var i = 0;i<pntGrid.length-1;i++){
				for(var j = 0;j<pntGrid[i].length-1;j++){
					var pntV4 = pntGrid[i][j];
                    var pntV1 = pntGrid[i][j + 1];
                    var pntV2 = pntGrid[i + 1][j + 1];
                    var pntV3 = pntGrid[i + 1][j];
                    
                    var type1 = GetTypValue(pntV1.Value, minValue, maxValue);
                    var type2 = GetTypValue(pntV2.Value, minValue, maxValue);
                    var type3 = GetTypValue(pntV3.Value, minValue, maxValue);
                    var type4 = GetTypValue(pntV4.Value, minValue, maxValue);
                    var type = type1.toString()+ type2.toString() + type3.toString() + type4.toString();
                    
                    var pnt1, pnt2, pnt3, pnt4, pnt5, pnt6, pnt7, pnt8;
                    var polygon = PolygonInfoClass.createNew(minValue);
                    var polyAdd = PolygonInfoClass.createNew(minValue);
                    var x1, y1, x2, y2, x3, y3, x4, y4;
                    var centerValue;
                    var centerType;
                    
                    switch (type)
                    {
                        case "0000":
                        case "2222":
                            break;
                        case "1111":
                        	polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                            listPolys.push(polygon);
                            break;
                         case "2221":   //single triangle 8个  已核对
                            x1 = pntV4.X + (maxValue - pntV4.Value) / (pntV3.Value - pntV4.Value) * (pntV3.X - pntV4.X);
                            y1 = pntV4.Y + (maxValue - pntV4.Value) / (pntV1.Value - pntV4.Value) * (pntV1.Y - pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x1, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV4.X, y1);
                            polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "2212":
                            x1 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            y1 = pntV3.Y + (maxValue - pntV3.EValue) / (pntV2.EValue - pntV3.EValue) * (pntV2.Y - pntV3.Y);
                            pnt4 = PointInfoClass.createNew(pntV3.X, y1);
                            pnt5 = PointInfoClass.createNew(x1, pntV3.Y);
                            polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt5);
                            listPolys.Add(polygon);
                            break;
                        case "2122":
                            x1 = pntV2.X + (maxValue - pntV2.EValue) / (pntV1.EValue - pntV2.EValue) * (pntV1.X - pntV2.X);
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt2 = PointInfoClass.createNew(x1, pntV2.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt3);
                            listPolys.Add(polygon);
                            break;
                        case "1222":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0001":
                            x1 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);
                            y1 = pntV4.Y + (minValue - pntV4.EValue) / (pntV1.EValue - pntV4.EValue) * (pntV1.Y - pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x1, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV4.X, y1);
                            polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                      	case "0010":
                            x1 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            y1 = pntV3.Y + (minValue - pntV3.EValue) / (pntV2.EValue - pntV3.EValue) * (pntV2.Y - pntV3.Y);
                            pnt4 = PointInfoClass.createNew(pntV3.X, y1);
                            pnt5 = PointInfoClass.createNew(x1, pntV3.Y);
                            polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt5);
                            listPolys.Add(polygon);
                            break;
                        case "0100":
                            x1 = pntV2.X + (minValue - pntV2.EValue) / (pntV1.EValue - pntV2.EValue) * (pntV1.X - pntV2.X);
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt2 = PointInfoClass.createNew(x1, pntV2.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt3);
                            listPolys.Add(polygon);
                            break;
                       	case "1000":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2220":   //single trapezoid 8个
                            x1 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);
                            y1 = pntV4.Y + (minValue - pntV4.EValue) / (pntV1.EValue - pntV4.EValue) * (pntV1.Y - pntV4.Y);
                            y2 = pntV4.Y + (maxValue - pntV4.EValue) / (pntV1.EValue - pntV4.EValue) * (pntV1.Y - pntV4.Y);

                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x1, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV4.X, y1);
                            pnt8 = PointInfoClass.createNew(pntV4.X, y2);
                            polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2202":
                            x1 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            x2 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            y1 = pntV3.Y + (minValue - pntV3.EValue) / (pntV2.EValue - pntV3.EValue) * (pntV2.Y - pntV3.Y);
                            y2 = pntV3.Y + (maxValue - pntV3.EValue) / (pntV2.EValue - pntV3.EValue) * (pntV2.Y - pntV3.Y);
                            pnt3 = PointInfoClass.createNew(pntV3.X, y2);
                            pnt4 = PointInfoClass.createNew(pntV3.X, y1);
                            pnt5 = PointInfoClass.createNew(x1, pntV3.Y);
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "2022":
                            x1 = pntV2.X + (minValue - pntV2.EValue) / (pntV1.EValue - pntV2.EValue) * (pntV1.X - pntV2.X);
                            x2 = pntV2.X + (maxValue - pntV2.EValue) / (pntV1.EValue - pntV2.EValue) * (pntV1.X - pntV2.X);
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt1 = PointInfoClass.createNew(x2, pntV2.Y);
                            pnt2 = PointInfoClass.createNew(x1, pntV2.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                            listPolys.Add(polygon);
                            break;
                      	case "0222":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0002":
                            x1 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);
                            y1 = pntV4.Y + (maxValue - pntV4.EValue) / (pntV1.EValue - pntV4.EValue) * (pntV1.Y - pntV4.Y);
                            y2 = pntV4.Y + (minValue - pntV4.EValue) / (pntV1.EValue - pntV4.EValue) * (pntV1.Y - pntV4.Y);

                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x1, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV4.X, y1);
                            pnt8 = PointInfoClass.createNew(pntV4.X, y2);
                            polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0020":
                            x1 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            x2 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            y1 = pntV3.Y + (maxValue - pntV3.EValue) / (pntV2.EValue - pntV3.EValue) * (pntV2.Y - pntV3.Y);
                            y2 = pntV3.Y + (minValue - pntV3.EValue) / (pntV2.EValue - pntV3.EValue) * (pntV2.Y - pntV3.Y);
                            pnt3 = PointInfoClass.createNew(pntV3.X, y2);
                            pnt4 = PointInfoClass.createNew(pntV3.X, y1);
                            pnt5 = PointInfoClass.createNew(x1, pntV3.Y);
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                      	case "0200":
                            x1 = pntV2.X + (maxValue - pntV2.EValue) / (pntV1.EValue - pntV2.EValue) * (pntV1.X - pntV2.X);
                            x2 = pntV2.X + (minValue - pntV2.EValue) / (pntV1.EValue - pntV2.EValue) * (pntV1.X - pntV2.X);
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt1 = PointInfoClass.createNew(x2, pntV2.Y);
                            pnt2 = PointInfoClass.createNew(x1, pntV2.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                            listPolys.Add(polygon);
                            break;
                        case "2000":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0011":  //single rectangle 12个
                            y1 = pntV3.Y + (minValue - pntV3.EValue) / (pntV2.EValue - pntV3.EValue) * (pntV2.Y - pntV3.Y);
                            y2 = pntV4.Y + (minValue - pntV4.EValue) / (pntV1.EValue - pntV4.EValue) * (pntV1.Y - pntV4.Y);
                            pnt4 = PointInfoClass.createNew(pntV3.X, y1);
                            pnt7 = PointInfoClass.createNew(pntV4.X, y2);
                            polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "0110":
                            x1 = pntV2.X + (minValue - pntV2.EValue) / (pntV1.EValue - pntV2.EValue) * (pntV1.X - pntV2.X);
                            x2 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            pnt2 = PointInfoClass.createNew(x1, pntV2.Y);
                            pnt5 = PointInfoClass.createNew(x2, pntV3.Y);
                            polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt5);
                            listPolys.Add(polygon);
                            break;
                        case "1100":
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt8);
                        	polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt3);
                            listPolys.Add(polygon);
                            break;
                        case "1001":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "2211":
                            y1 = pntV3.Y + (maxValue - pntV3.EValue) / (pntV2.EValue - pntV3.EValue) * (pntV2.Y - pntV3.Y);
                            y2 = pntV4.Y + (maxValue - pntV4.EValue) / (pntV1.EValue - pntV4.EValue) * (pntV1.Y - pntV4.Y);
                            pnt4 = PointInfoClass.createNew(pntV3.X, y1);
                            pnt7 = PointInfoClass.createNew(pntV4.X, y2);
                            polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "2112":
                            x1 = pntV2.X + (maxValue - pntV2.EValue) / (pntV1.EValue - pntV2.EValue) * (pntV1.X - pntV2.X);
                            x2 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            pnt2 = PointInfoClass.createNew(x1, pntV2.Y);
                            pnt5 = PointInfoClass.createNew(x2, pntV3.Y);
                            polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt5);
                            listPolys.Add(polygon);
                            break;
                        case "1122":
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt8);
                        	polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt3);
                            listPolys.Add(polygon);
                            break;
                        case "1221":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "2200":
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y3 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            y4 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y3);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y4);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2002":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x3 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            x4 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt5 = PointInfoClass.createNew(x4, pntV3.Y);
                            pnt6 = PointInfoClass.createNew(x3, pntV3.Y);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "0022":
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y3 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            y4 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y3);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y4);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0220":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x3 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            x4 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt5 = PointInfoClass.createNew(x4, pntV3.Y);
                            pnt6 = PointInfoClass.createNew(x3, pntV3.Y);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "0211":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2011":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2110":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt5 = PointInfoClass.createNew(x2, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0112":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X);
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt5 = PointInfoClass.createNew(x2, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "1102":
                            x1 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);//4
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x1, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "1120":
                            x1 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);//4
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x1, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "1021":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pntV1);
                            listPolys.Add(polygon);
                            break;
                        case "1201":   
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pntV1);
                            listPolys.Add(polygon);
                            break;
                        case "2101":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0121":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "1012":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x2 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "1210":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x2 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            y2 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "1211":  //single pentagon 24个
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                            listPolys.Add(polygon);
                            break;
                        case "1011":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                            listPolys.Add(polygon);
                            break;
                        case "2111":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0111":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y1);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "1112":
                            x2 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "1110":
                            x2 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            y2 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "1121":
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                            listPolys.Add(polygon);
                            break;
                        case "1101":
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                            listPolys.Add(polygon);
                            break;
                        case "1200":  //已核对
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "1022":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "0120":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x3 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x3, pntV3.Y);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "2102":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x3 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x3, pntV3.Y);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "0012": //已核对
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x2 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2210":  //已核对
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x2 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            y2 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt6 = PointInfoClass.createNew(x2, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2001":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            x3 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0221":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            x3 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "1002":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x3 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x3, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "1220":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x3 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            y2 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt2 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x3, pntV3.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            polygon.AddPoint(pntV1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pnt6);
                        	polygon.AddPoint(pnt7);
                            listPolys.Add(polygon);
                            break;
                        case "2100":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            y2 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0122":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            y2 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y2);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pntV2);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt7);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "0210":
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV3.X + (minValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt6 = PointInfoClass.createNew(x3, pntV3.Y);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "2012":
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV3.X + (maxValue - pntV3.EValue) / (pntV4.EValue - pntV3.EValue) * (pntV4.X - pntV3.X);  //6
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt6 = PointInfoClass.createNew(x3, pntV3.Y);
                            polygon.AddPoint(pnt1);
                        	polygon.AddPoint(pnt2);
                        	polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pntV3);
                        	polygon.AddPoint(pnt6);
                            listPolys.Add(polygon);
                            break;
                        case "0021":
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2201":
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x2 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x2, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y3);
                            polygon.AddPoint(pnt3);
                        	polygon.AddPoint(pnt4);
                        	polygon.AddPoint(pnt5);
                        	polygon.AddPoint(pntV4);
                        	polygon.AddPoint(pnt8);
                            listPolys.Add(polygon);
                            break;
                        case "2020":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x3 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x4 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //6
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y4 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x4, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);

                            if (centerType == 0)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt7);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt3);
	                        	polyAdd.AddPoint(pnt4);
	                        	polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pnt6);
                                listPolys.Add(polyAdd);
                            }
                            else if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt4);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt6);
	                        	polygon.AddPoint(pnt7);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            else
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt4);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pnt6);
	                        	polyAdd.AddPoint(pnt7);
	                        	polyAdd.AddPoint(pnt8);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "0202":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x3 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x4 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //6
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y4 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x4, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);

                            if (centerType == 2)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt7);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt3);
	                        	polyAdd.AddPoint(pnt4);
	                        	polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pnt6);
                                listPolys.Add(polyAdd);
                            }
                            else if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt4);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt6);
	                        	polygon.AddPoint(pnt7);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            else
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt4);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pnt6);
	                        	polyAdd.AddPoint(pnt7);
	                        	polyAdd.AddPoint(pnt8);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "0101":  
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y4 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);
                            if (centerType == 0)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pntV2);
	                        	polygon.AddPoint(pnt3);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pntV4);
	                        	polyAdd.AddPoint(pnt8);
                                listPolys.Add(polyAdd);
                            }
                            else if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pntV2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pntV4);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            break;
                        case "2121":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y4 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);
                            if (centerType == 2)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pntV2);
	                        	polygon.AddPoint(pnt3);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pntV4);
	                        	polyAdd.AddPoint(pnt8);
                                listPolys.Add(polyAdd);
                            }
                            else if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pntV2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pntV4);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            break;
                        case "1010":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);
                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y4 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);
                            if (centerType == 0)
                            {
                                polygon.AddPoint(pntV1);
	                        	polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pntV3);
	                        	polyAdd.AddPoint(pnt3);
                                listPolys.Add(polyAdd);
                            }
                            else if (centerType == 1)
                            {
                                polygon.AddPoint(pntV1);
	                        	polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pntV3);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            break;
                        case "1212":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);
                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y4 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);
                            if (centerType == 2)
                            {
                                polygon.AddPoint(pntV1);
	                        	polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pntV3);
	                        	polyAdd.AddPoint(pnt3);
                                listPolys.Add(polyAdd);
                            }
                            else if (centerType == 1)
                            {
                                polygon.AddPoint(pntV1);
	                        	polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pntV3);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            break;
                        case "2120":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x4 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //6
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y4 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x4, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);

                            if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pntV2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt6);
	                        	polygon.AddPoint(pnt7);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            else if (centerType == 2)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pntV2);
	                        	polygon.AddPoint(pnt3);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pnt6);
	                        	polyAdd.AddPoint(pnt7);
	                        	polyAdd.AddPoint(pnt8);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "0102":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x4 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //6
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y4 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x4, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);

                            if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pntV2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt6);
	                        	polygon.AddPoint(pnt7);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            else if (centerType == 0)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pntV2);
	                        	polygon.AddPoint(pnt3);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pnt6);
	                        	polyAdd.AddPoint(pnt7);
	                        	polyAdd.AddPoint(pnt8);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "2021":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x3 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);

                            if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt4);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pntV4);
	                        	polygon.AddPoint(pnt7);
                                listPolys.Add(polygon);
                            }
                            else if (centerType == 2)
                            {
                                polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pntV4);
	                        	polygon.AddPoint(pnt7);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt1);
	                        	polyAdd.AddPoint(pnt2);
	                        	polyAdd.AddPoint(pnt3);
	                        	polyAdd.AddPoint(pnt4);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "0201":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x3 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);

                            if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt4);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pntV4);
	                        	polygon.AddPoint(pnt7);
                                listPolys.Add(polygon);
                            }
                            else if (centerType == 0)
                            {
                                polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pntV4);
	                        	polygon.AddPoint(pnt7);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt1);
	                        	polyAdd.AddPoint(pnt2);
	                        	polyAdd.AddPoint(pnt3);
	                        	polyAdd.AddPoint(pnt4);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "1202":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x3 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x4 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //6
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x4, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            if (centerType == 1)
                            {
                                polygon.AddPoint(pntV1);
	                        	polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt4);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt6);
	                        	polygon.AddPoint(pnt7);
                                listPolys.Add(polygon);
                            }
                            else if (centerType == 2)
                            {
                                polygon.AddPoint(pntV1);
	                        	polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt7);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt3);
	                        	polyAdd.AddPoint(pnt4);
	                        	polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pnt6);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "1020":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            y2 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y);  //4
                            x3 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            x4 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //6
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt4 = PointInfoClass.createNew(pntV2.X, y2);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt6 = PointInfoClass.createNew(x4, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            if (centerType == 1)
                            {
                                polygon.AddPoint(pntV1);
	                        	polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pnt4);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt6);
	                        	polygon.AddPoint(pnt7);
                                listPolys.Add(polygon);
                            }
                            else if (centerType == 0)
                            {
                                polygon.AddPoint(pntV1);
	                        	polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt7);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt3);
	                        	polyAdd.AddPoint(pnt4);
	                        	polyAdd.AddPoint(pnt5);
	                        	polyAdd.AddPoint(pnt6);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "0212":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (maxValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV4.X + (maxValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y3 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y4 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);
                            if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pntV3);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt7);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            else if (centerType == 2)
                            { 
                                polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pntV3);
	                        	polygon.AddPoint(pnt5);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt1);
	                        	polyAdd.AddPoint(pnt2);
	                        	polyAdd.AddPoint(pnt7);
	                        	polyAdd.AddPoint(pnt8);
                                listPolys.Add(polyAdd);
                            }
                            break;
                        case "2010":
                            centerValue = (pntV1.EValue + pntV2.EValue + pntV3.EValue + pntV4.EValue) / 4;
                            centerType = GetTypeValue(centerValue, minValue, maxValue);

                            x1 = pntV1.X + (maxValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //1
                            x2 = pntV1.X + (minValue - pntV1.EValue) / (pntV2.EValue - pntV1.EValue) * (pntV2.X - pntV1.X); //2
                            y1 = pntV2.Y + (minValue - pntV2.EValue) / (pntV3.EValue - pntV2.EValue) * (pntV3.Y - pntV2.Y); //3
                            x3 = pntV4.X + (minValue - pntV4.EValue) / (pntV3.EValue - pntV4.EValue) * (pntV3.X - pntV4.X);  //5
                            y3 = pntV1.Y + (minValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //7
                            y4 = pntV1.Y + (maxValue - pntV1.EValue) / (pntV4.EValue - pntV1.EValue) * (pntV4.Y - pntV1.Y);  //8
                            pnt1 = PointInfoClass.createNew(x1, pntV1.Y);
                            pnt2 = PointInfoClass.createNew(x2, pntV1.Y);
                            pnt3 = PointInfoClass.createNew(pntV2.X, y1);
                            pnt5 = PointInfoClass.createNew(x3, pntV4.Y);
                            pnt7 = PointInfoClass.createNew(pntV1.X, y3);
                            pnt8 = PointInfoClass.createNew(pntV1.X, y4);
                            if (centerType == 1)
                            {
                                polygon.AddPoint(pnt1);
	                        	polygon.AddPoint(pnt2);
	                        	polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pntV3);
	                        	polygon.AddPoint(pnt5);
	                        	polygon.AddPoint(pnt7);
	                        	polygon.AddPoint(pnt8);
                                listPolys.Add(polygon);
                            }
                            else if (centerType == 2)
                            {
                                polygon.AddPoint(pnt3);
	                        	polygon.AddPoint(pntV3);
	                        	polygon.AddPoint(pnt5);
                                listPolys.Add(polygon);
                                polyAdd.AddPoint(pnt1);
	                        	polyAdd.AddPoint(pnt2);
	                        	polyAdd.AddPoint(pnt7);
	                        	polyAdd.AddPoint(pnt8);
                                listPolys.Add(polyAdd);
                            }
                            break;
                    }
				}
			}
		};
		
		gridsInfo.ContourBands = function(listContourValues){
			listPolygons.splice(0,listPolygons.length);
			GetGrids();
			for(var i = 0;i<listContourValues.length;i++){
				var min,max;
				if(i===listContourValues.length-1){
					min = listContourValues[i];
					max = listContourValues[i]*50;
				}
				else{
					min = listContourValues[i];
					max = listContourValues[i+1];
				}
				GetContourBand(min,max);
			}
		};
		return gridsInfo;
	};
};
