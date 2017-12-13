/*
 * 规则格网等值线追踪算法，包括等值线追踪和平滑
 * 初始化输入格网信息，GridClass成果
 * 作者：maxiaoling
 * 创建日期：2017.11.24
 * 等值线生成方法：
 * 1、按照维基百科中方法进行等值短线查找，然后将短线进行首尾的合并形成等值线。等值短线走向使用中点值判断法。 2017.11.24
 * 等值线平滑方法：
 * 1、三次B样条曲线方法，方法来自https://github.com/likev/contour.js/blob/master/dengzhixian.js  2017.11.24
 */
var GridIsoline = {
	createNew: function(grid) {
		var gridIsoLine = {};
		var listIsolines = new Array();
        var tempIsolines = new Array();
		var pntGrid = grid;
		
		/*
		 * 维基百科方法生成等值线，并实现等值线的合并
		 */
		gridIsoLine.WikiIsoline = function(listContourValues) {
			listIsolines.splice(0, listIsolines.length); //清空数组
			for(var i = 0; i < listContourValues.length; i++) {
				GetIsolines(listContourValues[i]);
				MergeIsolines();
				
				for(var j=0;j<tempIsolines.length;j++){
					var tempLine = tempIsolines[j];
					
					tempLine.Label = GetLabelInfo(tempLine);
					
					var pntss = BsLine(tempLine,10);
					tempLine.ListVertrix = pntss;
					listIsolines.push(tempLine);
				}
				tempIsolines.splice(0,tempIsolines.length);
			}
			
			return listIsolines; 
		};
		
		/*
		 * 将组成线的点转换成面的点数组，后面将点的数组换掉
		 * 2017.12.13，遗留工作标记
		 */
		var TransPntArrayToCoors = function(pntArray){
			var coords = new Array();
			for(var i = 0;i<pntArray.length;i++){
				coords.push([pntArray[i].X,pntArray[i].Y]);
			}
			return coords;
		};
		
		var GetIsoBands = function(yMax,yMin,xMax,xMin){
			var listClass1 = new Array();
			var listClass2 = new Array();
			var listClass3 = new Array();
			var listClass4 = new Array();
			var listClass5 = new Array();
			var listClass6 = new Array();
			var listClass7 = new Array();
			var listClass8 = new Array();
			var listClass9 = new Array();
			var listClass10 = new Array();
			var listClass11 = new Array();
			
			var  isoRing,isoRingInfo,ringId;
			for(var i=0;i<listIsolines.length;i++){
				var line = lineResults[i];
				if(line.LineType){  //开放型
					var pntFrom = line.GetLineFrom();
					var pntEnd = line.GetLineEnd();
					var type1,type2,ringCompare;
					if(Math.abs(pntFrom.X - xMin) < 0.0000001){
						type1 = 1;
					}
					else if(Math.abs(pntFrom.X - xMax) < 0.0000001){
						type1 = 3;
					}
					else if(Math.abs(pntFrom.Y - yMin) < 0.0000001){
						type1 = 4;
					}
					else if(Math.abs(pntFrom.Y - yMax) < 0.0000001){
						type1 = 2;
					}
					if(Math.abs(pntEnd.X - xMin) < 0.0000001){
						type2 = 1;
					}
					else if(Math.abs(pntEnd.X - xMax) < 0.0000001){
						type2 = 3;
					}
					else if(Math.abs(pntEnd.Y - yMin) < 0.0000001){
						type2 = 4;
					}
					else if(Math.abs(pntEnd.Y - yMax) < 0.0000001){
						type2 = 2;
					}
					var type = type1.toString()+type2.toString();
					
					
					switch(type){
						case "33":   //第2类
							ringId = "33" + listClass2.length.toString();
							isoRing = new IsoRing(TransPntArrayToCoors(line.ListVertrix));
							isoRingInfo = new IsoRingInfo(ringId,isoRing,line.LineValue);
							
							for(var j = 0;j<listClass2.length; j++){
								ringCompare = listClass2[j];
								if(ringCompare.isoRing.JudgePntInRing(pntFrom)){
									
								}
							}
							
							//以线的起始点判断是否包含关系
//							for(var j = 0;j<listClass2.length; j++){
//								lineCompare = listClass2[j];
//								if(pntFrom.Y > lineCompare.GetLineFrom().Y && pntFrom.Y > lineCompare.GetLineEnd().Y){
//									listClass2.splice(j,0,line);  
//									break;
//								}
//							}
							listClass2.push(isoRingInfo);
							break;
						case "11":  //第3类
							for(var j = 0;j<listClass3.length;j++){
								lineCompare = listClass3[j];
								if(pntFrom.Y > lineCompare.GetLineFrom().Y && pntFrom.Y > lineCompare.GetLineEnd().Y){
									listClass3.splice(j,0,line);
									break;
								}
							}
							listClass3.push(line);
							break;
						case "44": //第4类
							for(var j = 0;j<listClass4.length;j++){
								lineCompare = listClass4[j];
								if(pntFrom.X > lineCompare.GetLineFrom().X && pntFrom.X > lineCompare.GetLineEnd().X){
									listClass4.splice(j,0,line);
									break;
								}
							}
							listClass4.push(line);
							break;
						case "22":  //第5类
							for(var j = 0;j<listClass5.length;j++){
								lineCompare = listClass5[j];
								if(pntFrom.X > lineCompare.GetLineFrom().X && pntFrom.X > lineCompare.GetLineEnd().X){
									listClass5.splice(j,0,line);
									break;
								}
							}
							listClass5.push(line);
							break;
						case "12":  //第6类
						case "21":
							for(var j = 0;j<listClass6.length;j++){
								lineCompare = listClass6[j];
								if(pntFrom.X > lineCompare.GetLineFrom().X && pntFrom.X > lineCompare.GetLineEnd().X){
									listClass6.splice(j,0,line);
									break;
								}
								else if(pntFrom.Y < lineCompare.GetLineFrom().Y && pntFrom.Y < lineCompare.GetLineEnd().Y){
									listClass6.splice(j,0,line);
									break;
								}
							}
							listClass6.push(line);
							break;
						case "14":  //第7类
						case "41":
							for(var j = 0;j<listClass7.length;j++){
								lineCompare = listClass7[j];
								if(pntFrom.X > lineCompare.GetLineFrom().X && pntFrom.X > lineCompare.GetLineEnd().X){
									listClass7.splice(j,0,line);
									break;
								}
								else if(pntFrom.Y > lineCompare.GetLineFrom().Y && pntFrom.Y > lineCompare.GetLineEnd().Y){
									listClass7.splice(j,0,line);
									break;
								}
							}
							listClass7.push(line);
							break;
						case "34":  //第8类
						case "43":
							for(var j = 0;j<listClass8.length;j++){
								lineCompare = listClass8[j];
								if(pntFrom.X < lineCompare.GetLineFrom().X && pntFrom.X < lineCompare.GetLineEnd().X){
									listClass8.splice(j,0,line);
									break;
								}
								else if(pntFrom.Y > lineCompare.GetLineFrom().Y && pntFrom.Y > lineCompare.GetLineEnd().Y){
									listClass8.splice(j,0,line);
									break;
								}
							}
							listClass8.push(line);
							break;
						case "23":   //第9类
						case "32":
							for(var j = 0;j<listClass9.length;j++){
								lineCompare = listClass9[j];
								if(pntFrom.X < lineCompare.GetLineFrom().X && pntFrom.X < lineCompare.GetLineEnd().X){
									listClass9.splice(j,0,line);
									break;
								}
								else if(pntFrom.Y < lineCompare.GetLineFrom().Y && pntFrom.Y < lineCompare.GetLineEnd().Y){
									listClass9.splice(j,0,line);
									break;
								}
							}
							listClass9.push(line);
							break;
						case "13":  //第10类
						case "31":
							for(var j = 0;j<listClass10.length;j++){
								lineCompare = listClass10[j];
								if(pntFrom.Y > lineCompare.GetLineFrom().Y){
									listClass10.splice(j,0,line);
									break;
								}
							}
							listClass10.push(line);
							break;
						case "24":  //第11类
						case "42":
							for(var j = 0;j<listClass11.length;j++){
								lineCompare = listClass11[j];
								if(pntFrom.X > lineCompare.GetLineFrom().X){
									listClass11.splice(j,0,line);
									break;
								}
							}
							listClass11.push(line);
							break;
					}
				}
				else{   //闭合型，反向遍历，第1类
					for(var j = listClass1.length - 1; j>=0; j++){
						lineCompare = listClass1[j];
						if(JudgePntInPolygon(pntFrom,lineCompare.ListVertrix)){
							listClass1.splice(j+1,0,line);
						}
					}
					listClass1.push(line);
				}
			}
			/*
			 * 将线转换成面，并判断包含关系
			 */
			
		}
		
		
		
		/*
		 * 判断点是否在多边形内
		 * http://blog.csdn.net/qq_22929803/article/details/46818009
		 */
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
		 * 获取等值线的标注信息，包括位置，角度以及值
		 */
		var GetLabelInfo = function(isoline){
//			alert(isoline.LineValue);
			var pntLabel,angle;
			var maxDis = 0;
			var linePnts = isoline.ListVertrix;
			var pnt1,pnt2,dis;
			for(var i = 0; i < linePnts.length - 1; i++){
				pnt1 = linePnts[i];
				pnt2 = linePnts[i + 1];
				dis = Math.sqrt((pnt1.X - pnt2.X)*(pnt1.X - pnt2.X) + (pnt1.Y - pnt2.Y)*(pnt1.Y - pnt2.Y));
				if(dis>maxDis){
					pntLabel = new PointInfo((pnt1.X+pnt2.X)/2,(pnt1.Y+pnt2.Y)/2);
					angle = (pnt2.Y - pnt1.Y)/(pnt2.X - pnt1.X);
				}
			}
			return new LabelInfo(pntLabel,angle,isoline.LineValue);
		}
		
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
		
		var GetIsolines = function(lineValue){
			tempIsolines.splice(0, tempIsolines.length); //清空数组
			for(var i = 0; i < pntGrid.length - 1; i++) {
				for(var j = 0; j < pntGrid[i].length - 1; j++) {
					var pntV4 = pntGrid[i][j];
					var pntV1 = pntGrid[i][j + 1];
					var pntV2 = pntGrid[i + 1][j + 1];
					var pntV3 = pntGrid[i + 1][j];

					var type1 = GetTypeValue(pntV1.Z, lineValue);
					var type2 = GetTypeValue(pntV2.Z, lineValue);
					var type3 = GetTypeValue(pntV3.Z, lineValue);
					var type4 = GetTypeValue(pntV4.Z, lineValue);
					var type = type1.toString() + type2.toString() + type3.toString() + type4.toString();
					
					//j为0时，点4为边界点；i为0时，点1为边界点；i为length-1时，点3为边界点；j为length-1时，点2为边界点
					var pnt1,pnt2,pnt3,pnt4;
					var x1, y1, x2, y2;
					switch(type){
						case '0000':
						case '1111':
							break;
						case '0001':  //1
						case '1110': //14
							x1 = pntV4.X + (lineValue - pntV4.Z) / (pntV3.Z - pntV4.Z) * (pntV3.X - pntV4.X);
							y1 = pntV4.Y + (lineValue - pntV4.Z) / (pntV1.Z - pntV4.Z) * (pntV1.Y - pntV4.Y);
							if(i === 0)  
							{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,true);
								
							}else{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
							}
							if(j === 0){
								pnt4 = new PointInfo(x1,pntV4.Y,lineValue,true);
							}
							else{
								pnt4 = new PointInfo(x1,pntV4.Y,lineValue,false);
							}
							UpdateIsolines(pnt1,pnt4,lineValue);
							break;
						case '0010'://2
						case '1101'://13
							x1 = pntV4.X + (lineValue - pntV4.Z) / (pntV3.Z - pntV4.Z) * (pntV3.X - pntV4.X);
							y1 = pntV3.Y + (lineValue - pntV3.Z) / (pntV2.Z - pntV3.Z) * (pntV2.Y - pntV3.Y);
							if(i === pntGrid.length - 2)  
							{
								pnt3 = new PointInfo(pntV3.X,y1,lineValue,true);
								
							}else{
								pnt3 = new PointInfo(pntV3.X,y1,lineValue,false);
							}
							if(j === 0){
								pnt4 = new PointInfo(x1,pntV4.Y,lineValue,true);
							}
							else{
								pnt4 = new PointInfo(x1,pntV4.Y,lineValue,false);
							}
							UpdateIsolines(pnt3,pnt4,lineValue);
							break;
						case '0011':  //3
						case '1100':  //12
							y1 = pntV4.Y + (lineValue - pntV4.Z) / (pntV1.Z - pntV4.Z) * (pntV1.Y - pntV4.Y);
							y2 = pntV3.Y + (lineValue - pntV3.Z) / (pntV2.Z - pntV3.Z) * (pntV2.Y - pntV3.Y);
							if(i === 0)  
							{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,true);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
								
							}
							else if(i === pntGrid.length - 2)  
							{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,true);
							}
							else{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							UpdateIsolines(pnt3,pnt1,lineValue);
							break;
						case '0100':   //4
						case '1011':   //11
							x1 = pntV1.X + (lineValue - pntV1.Z) / (pntV2.Z - pntV1.Z) * (pntV2.X - pntV1.X);
							y2 = pntV3.Y + (lineValue - pntV3.Z) / (pntV2.Z - pntV3.Z) * (pntV2.Y - pntV3.Y);
							if(j === pntGrid[i].length - 2){
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,true);
							}
							else{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
							}
							if(i === pntGrid.length - 2)  
							{
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,true);
							}
							else{
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							UpdateIsolines(pnt3,pnt2,lineValue);
							break;
						case '0101': //5
							y1 = pntV4.Y + (lineValue - pntV4.Z) / (pntV1.Z - pntV4.Z) * (pntV1.Y - pntV4.Y);
							x1 = pntV1.X + (lineValue - pntV1.Z) / (pntV2.Z - pntV1.Z) * (pntV2.X - pntV1.X);
							y2 = pntV3.Y + (lineValue - pntV3.Z) / (pntV2.Z - pntV3.Z) * (pntV2.Y - pntV3.Y);
							x2 = pntV4.X + (lineValue - pntV4.Z) / (pntV3.Z - pntV4.Z) * (pntV3.X - pntV4.X);
							if(j===0){
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,true);
							}
							else if(j === pntGrid[i].length - 2)
							{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,true);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,false);
							}
							else{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,false);
							}
							if(i === 0){
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,true);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							else if(i === pntGrid.length - 2)  
							{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,true);
							}
							else{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							UpdateIsolines(pnt1,pnt2,lineValue);
							UpdateIsolines(pnt3,pnt4,lineValue);
							break;
						case '0110':  //6
						case '1001':  //9
							x1 = pntV1.X + (lineValue - pntV1.Z) / (pntV2.Z - pntV1.Z) * (pntV2.X - pntV1.X);
							x2 = pntV4.X + (lineValue - pntV4.Z) / (pntV3.Z - pntV4.Z) * (pntV3.X - pntV4.X);
							if(j===0){
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,true);
							}
							else if(j=== pntGrid[i].length - 2)
							{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,true);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,false);
							}
							else{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,false);
							}
							UpdateIsolines(pnt4,pnt2,lineValue);
							break;
						case '0111':  //7
						case '1000': //8
							y1 = pntV4.Y + (lineValue - pntV4.Z) / (pntV1.Z - pntV4.Z) * (pntV1.Y - pntV4.Y);
							x1 = pntV1.X + (lineValue - pntV1.Z) / (pntV2.Z - pntV1.Z) * (pntV2.X - pntV1.X);
							if(j === pntGrid[i].length - 2){
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,true);
							}
							else{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
							}
							if(i===0){
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,true);
							}
							else{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
							}
							UpdateIsolines(pnt1,pnt2,lineValue);
							break;
						case '1010':  //10
							y1 = pntV4.Y + (lineValue - pntV4.Z) / (pntV1.Z - pntV4.Z) * (pntV1.Y - pntV4.Y);
							x1 = pntV1.X + (lineValue - pntV1.Z) / (pntV2.Z - pntV1.Z) * (pntV2.X - pntV1.X);
							y2 = pntV3.Y + (lineValue - pntV3.Z) / (pntV2.Z - pntV3.Z) * (pntV2.Y - pntV3.Y);
							x2 = pntV4.X + (lineValue - pntV4.Z) / (pntV3.Z - pntV4.Z) * (pntV3.X - pntV4.X);
							if(j===0){
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,true);
							}
							else if(j=== pntGrid[i].length - 2)
							{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,true);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,false);
							}
							else{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,false);
							}
							if(i===0){
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,true);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							else if(i === pntGrid.length - 2)  
							{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,true);
							}
							else{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							UpdateIsolines(pnt3,pnt2,lineValue);
							UpdateIsolines(pnt1,pnt4,lineValue);
							break;
					}
				}
			}
		}
		
		/*
		 * 合并单值等值线，将一段一段的线合并为一整条等值线
		 */
		var MergeIsolines = function(){
			for(var i = 0;i < tempIsolines.length; i++){
				var line = tempIsolines[i];
				if(line.FinishState)
					continue;
				if(MergeLine(i)){
					tempIsolines.splice(i,1);
					i=0;
				}
			}
		}
		/*
		 * 指定某段线的合并实现
		 */
		var MergeLine = function(index){
			var line = tempIsolines[index];
			for(var i = 0;i < tempIsolines.length; i++){
				if(i === index)
					continue;
				var lineM = tempIsolines[i];
				if(lineM.FinishState)
					continue;
				var pntMFrom = lineM.GetLineFrom();
				var pntMEnd = lineM.GetLineEnd();
				
				var pntFrom = line.GetLineFrom();
				var pntEnd = line.GetLineEnd();
				
				if(pntMFrom.Equals(pntFrom) && pntMEnd.Equals(pntEnd)){  //首尾相接
					lineM.ListVertrix = lineM.ListVertrix.concat(line.ListVertrix.reverse());
					lineM.FinishState = true;
					return true;
				}
				else if(pntMFrom.Equals(pntEnd) && pntMEnd.Equals(pntFrom)){  //首尾相接
					lineM.ListVertrix = lineM.ListVertrix.concat(line.ListVertrix);
					lineM.FinishState = true;
					return true;
				}
				else if(pntMFrom.Equals(pntFrom)){
					lineM.ListVertrix = lineM.ListVertrix.reverse().concat(line.ListVertrix);
					if(pntMEnd.IsEdge && pntEnd.IsEdge)
					{
						lineM.FinishState = true;
					}
					lineM.LineType = (lineM.LineType || line.LineType);
					return true;
				}
				else if(pntMFrom.Equals(pntEnd)){
					lineM.ListVertrix = line.ListVertrix.concat(lineM.ListVertrix);
					if(pntMEnd.IsEdge && pntFrom.IsEdge)
					{
						lineM.FinishState = true;
					}
					lineM.LineType = (lineM.LineType || line.LineType);
					return true;
				}
				else if(pntMEnd.Equals(pntFrom)){
					lineM.ListVertrix = lineM.ListVertrix.concat(line.ListVertrix);
					if(pntMFrom.IsEdge && pntEnd.IsEdge)
					{
						lineM.FinishState = true;
					}
					lineM.LineType = (lineM.LineType || line.LineType);
					return true;
				}
				else if(pntMEnd.Equals(pntEnd)){
					lineM.ListVertrix = lineM.ListVertrix.concat(line.ListVertrix.reverse());
					if(pntMFrom.IsEdge && pntFrom.IsEdge){
						lineM.FinishState = true;
					}
					lineM.LineType = (lineM.LineType || line.LineType);
					return true;
				}
//				else 
//					return false;
			}
			
			return false;
		}
		
		/*
		 * 将追踪的短线段添加到等值线列表中
		 * 输入参数lineFromPnt和lineToPnt，分别标识短线段的起始点
		 */
		var UpdateIsolines = function(lineFromPnt,lineToPnt,value){
			//当两个点都是边界点时，该等值线由这两个点组成
			if(lineFromPnt.IsEdge && lineToPnt.IsEdge){
				var isoline = new IsolineInfo(value);  
				isoline.AddPointInfo(lineFromPnt);
				isoline.AddPointInfo(lineToPnt);
				isoline.LineType = true;  //开放型等值线
				isoline.FinishState = true;  
				tempIsolines.push(isoline);
			}
			else{
				var matchFlag = false;
				if(tempIsolines.length > 0){   //当等值线数量为空时
					for(var i = 0;i<tempIsolines.length-1;i++){  //遍历所有的等值线
						var isoline = tempIsolines[i];
						if(isoline.FinishState)  //如果等值线追踪完成
							continue;
						matchFlag = false;
						var pntStart = isoline.GetLineFrom();
						var pntEnd = isoline.GetLineEnd();
						if(pntStart.IsEdge){
							if(lineFromPnt.IsEdge){
								matchFlag = pntEnd.Equals(lineToPnt);
								if(matchFlag){
									isoline.AddPointInfo(lineFromPnt);
									isoline.FinishState = true;
								}
							}
							else if(lineToPnt.IsEdge){
								matchFlag = pntEnd.Equals(lineFromPnt);
								if(matchFlag){
									isoline.AddPointInfo(lineToPnt);
									isoline.FinishState = true;
								}
							}
							else{
								matchFlag = pntEnd.Equals(lineToPnt);
								if(matchFlag){
									isoline.AddPointInfo(lineFromPnt);
								}
								else{
									matchFlag = pntEnd.Equals(lineFromPnt);
									if(matchFlag){
										isoline.AddPointInfo(lineToPnt);
									}
								}
							}
						}
						else if(pntEnd.IsEdge){   //在等值线的起始点插入值
							if(lineFromPnt.IsEdge){
								matchFlag = pntStart.Equals(lineToPnt);
								if(matchFlag){
									isoline.AddPointInfo(lineToPnt,0);
									isoline.AddPointInfo(lineFromPnt,0);
									isoline.FinishState = true;
									alert("finish 2");
								}
							}
							else if(lineToPnt.IsEdge){
								matchFlag = pntStart.Equals(lineFromPnt);
								if(matchFlag){
									isoline.AddPointInfo(lineFromPnt,0);
									isoline.AddPointInfo(lineToPnt,0);
									isoline.FinishState = true;
									alert("finish 2");
								}
							}
							else{
								matchFlag = pntStart.Equals(lineToPnt);
								if(matchFlag){
									isoline.AddPointInfo(lineFromPnt,0);
								}
								else{
									matchFlag = pntStart.Equals(lineFromPnt);
									if(matchFlag){
										isoline.AddPointInfo(lineToPnt,0);
									}
								}
							}
						}
						else{
							if(lineFromPnt.IsEdge){
								matchFlag = pntStart.Equals(lineToPnt);
								if(matchFlag){
									isoline.AddPointInfo(lineFromPnt,0);
									isoline.LineType = true;
								}
								else{
									matchFlag = pntEnd.Equals(lineToPnt);
									if(matchFlag){
										isoline.AddPointInfo(lineFromPnt);
										isoline.LineType = true;
									}
								}
							}
							else if(lineToPnt.IsEdge){
								matchFlag = pntStart.Equals(lineFromPnt);
								if(matchFlag){
									isoline.AddPointInfo(lineToPnt,0);
									isoline.LineType = true;
								}
								else{
									matchFlag = pntEnd.Equals(lineFromPnt);
									if(matchFlag){
										isoline.AddPointInfo(lineToPnt);
										isoline.LineType = true;
									}
								}
							}
							else{
								matchFlag = true;
								if(pntStart.Equals(lineFromPnt)&&pntEnd.Equals(lineToPnt)){
									isoline.AddPointInfo(lineFromPnt);
									isoline.FinishState = true;
									alert("finish 3");
								}
								else if(pntStart.Equals(lineToPnt)&&pntEnd.Equals(lineFromPnt)){
									isoline.AddPointInfo(lineToPnt);
									isoline.FinishState = true;
									alert("finish 3");
								}
								else if(pntStart.Equals(lineFromPnt)){
									isoline.AddPointInfo(lineToPnt,0);
								}
								else if(pntStart.Equals(lineToPnt)){
									isoline.AddPointInfo(lineFromPnt,0);
								}
								else if(pntEnd.Equals(lineFromPnt)){
									isoline.AddPointInfo(lineToPnt);
								}
								else if(pntEnd.Equals(lineToPnt)){
									isoline.AddPointInfo(lineFromPnt);
								}
								else{
									matchFlag = false;
								}
							}
						}
						if(matchFlag)  //如果找到匹配的等值线，则跳出循环
							break;
					}
				}
				if(!matchFlag){    //如果没有找到匹配的等值线，则添加一条新的等值线
					var isoline = new IsolineInfo(value);  
					isoline.AddPointInfo(lineFromPnt);
					isoline.AddPointInfo(lineToPnt);
					
					if(lineFromPnt.IsEdge || lineToPnt.IsEdge){
						isoline.LineType = true;  //开放型等值线
					}
					tempIsolines.push(isoline);
				}
			}
		}
		
		/*
		 * 判断值格网点值与目标值的关系，小于最小值返回0，大于等于返回1
		 */
		var GetTypeValue = function(zValue, lineValue) {
			var type = -1;
			if(zValue < lineValue) {
				type = 0;
			} else if(zValue >= lineValue) {
				type = 1;
			} 
//			else if(zValue > lineValue) {
//				type = 2;
//			}
			return type;
		};
		
		return gridIsoLine;
	}
}