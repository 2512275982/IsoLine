/*
 * 格网生成等值面
 * 初始化输入格网信息
 */
var GridIsoline = {
	createNew: function(grid) {
		var gridIsoLine = {};
		var listIsolines = new Array();
		var pntGrid = grid;
		
		/*
		 * 维基百科方法生成等值面
		 */
		gridIsoLine.WikiIsoline = function(listContourValues) {
			listIsolines.splice(0, listIsolines.length); //清空数组
			for(var i = 0; i < listContourValues.length; i++) {
				GetIsolines(listContourValues[i]);
				
			}
			
			return listIsolines;
		};
		
		var GetIsolines = function(lineValue){
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
					
					//j为0时，点1为边界点；i为0时，点2为边界点；i为length-1时，点4为边界点；j为length-1时，点3为边界点
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
							UpdateIsolines(pnt1,pnt4);
							break;
						case '0010'://2
						case '1101'://13
							x1 = pntV4.X + (lineValue - pntV4.Z) / (pntV3.Z - pntV4.Z) * (pntV3.X - pntV4.X);
							y1 = pntV3.Y + (lineValue - pntV3.Z) / (pntV2.Z - pntV3.Z) * (pntV2.Y - pntV3.Y);
							if(i === pntGrid.length - 1)  
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
							UpdateIsolines(pnt3,pnt4);
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
							else if(i === pntGrid.length - 1)  
							{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,true);
							}
							else{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							UpdateIsolines(pnt3,pnt1);
							break;
						case '0100':   //4
						case '1011':   //11
							x1 = pntV1.X + (lineValue - pntV1.Z) / (pntV2.Z - pntV1.Z) * (pntV2.X - pntV1.X);
							y2 = pntV3.Y + (lineValue - pntV3.Z) / (pntV2.Z - pntV3.Z) * (pntV2.Y - pntV3.Y);
							if(j === pntGrid[i].length - 1){
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,true);
							}
							else{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
							}
							if(i === pntGrid.length - 1)  
							{
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,true);
							}
							else{
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							UpdateIsolines(pnt3,pnt2);
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
							else if(j === pntGrid[i].length - 1)
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
							else if(i === pntGrid.length - 1)  
							{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,true);
							}
							else{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							UpdateIsolines(pnt1,pnt2);
							UpdateIsolines(pnt3,pnt4);
							break;
						case '0110':  //6
						case '1001':  //9
							x1 = pntV1.X + (lineValue - pntV1.Z) / (pntV2.Z - pntV1.Z) * (pntV2.X - pntV1.X);
							x2 = pntV4.X + (lineValue - pntV4.Z) / (pntV3.Z - pntV4.Z) * (pntV3.X - pntV4.X);
							if(j===0){
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,true);
							}
							else if(j=== pntGrid[i].length - 1)
							{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,true);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,false);
							}
							else{
								pnt2 = new PointInfo(x1,pntV1.Y,lineValue,false);
								pnt4 = new PointInfo(x2,pntV4.Y,lineValue,false);
							}
							UpdateIsolines(pnt4,pnt2);
							break;
						case '0111':  //7
						case '1000': //8
							y1 = pntV4.Y + (lineValue - pntV4.Z) / (pntV1.Z - pntV4.Z) * (pntV1.Y - pntV4.Y);
							x1 = pntV1.X + (lineValue - pntV1.Z) / (pntV2.Z - pntV1.Z) * (pntV2.X - pntV1.X);
							if(j === pntGrid[i].length - 1){
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
							UpdateIsolines(pnt1,pnt2);
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
							else if(j=== pntGrid[i].length - 1)
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
							else if(i === pntGrid.length - 1)  
							{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,true);
							}
							else{
								pnt1 = new PointInfo(pntV1.X,y1,lineValue,false);
								pnt3 = new PointInfo(pntV3.X,y2,lineValue,false);
							}
							UpdateIsolines(pnt3,pnt2);
							UpdateIsolines(pnt1,pnt4);
							break;
					}
				}
			}
		}
		
		var MergeIsolines = function(){
			for(var i = 0;i < listIsolines.length; i++){
				var line = listIsolines[i];
				if(line.FinishState)
					continue;
				
			}
		}
		
		var MergeLine = function(line){
			for(var i = 0;i < listIsolines.length; i++){
				var lineM = listIsolines[i];
				
			}
		}
		
		/*
		 * 将追踪的短线段添加到等值线列表中
		 * 输入参数lineFromPnt和lineToPnt，分别标识短线段的起始点
		 */
		var UpdateIsolines = function(lineFromPnt,lineToPnt){
			//当两个点都是边界点时，该等值线由这两个点组成
			if(lineFromPnt.IsEdge && lineToPnt.IsEdge){
				var isoline = new IsolineInfo();  
				isoline.AddPointInfo(lineFromPnt);
				isoline.AddPointInfo(lineToPnt);
				isoline.LineType = true;  //开放型等值线
				isoline.FinishState = true;  
				alert("finish  1");
				listIsolines.push(isoline);
			}
			else{
				var matchFlag = false;
				if(listIsolines.length > 0){   //当等值线数量为空时
					for(var i = 0;i<listIsolines.length-1;i++){  //遍历所有的等值线
						var isoline = listIsolines[i];
						if(isoline.FinishState)  //如果等值线追踪完成
							continue;
						matchFlag = false;
						var pntStart = isoline.GetLineFrom();
						var pntEnd = isoline.GetLineEnd();
						if(pntStart.IsEdge){
							if(lineFromPnt.IsEdge){
								matchFlag = pntEnd.Equals(lineToPnt);
								if(matchFlag){
//									isoline.AddPointInfo(lineToPnt);
									isoline.AddPointInfo(lineFromPnt);
									isoline.FinishState = true;
									alert("finish 2");
								}
							}
							else if(lineToPnt.IsEdge){
								matchFlag = pntEnd.Equals(lineFromPnt);
								if(matchFlag){
//									isoline.AddPointInfo(lineFromPnt);
									isoline.AddPointInfo(lineToPnt);
									isoline.FinishState = true;
									alert("finish 2");
								}
							}
							else{
								matchFlag = pntEnd.Equals(lineToPnt);
								if(matchFlag){
//									isoline.AddPointInfo(lineToPnt);
									isoline.AddPointInfo(lineFromPnt);
//									isoline.FinishState = true;
//									alert("finish 2");
								}
								else{
									matchFlag = pntEnd.Equals(lineFromPnt);
									if(matchFlag){
//										isoline.AddPointInfo(lineFromPnt);
										isoline.AddPointInfo(lineToPnt);
//										isoline.FinishState = true;
//										alert("finish 2");
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
//									isoline.AddPointInfo(lineToPnt,0);
									isoline.AddPointInfo(lineFromPnt,0);
//									isoline.FinishState = true;
//									alert("finish 2");
								}
								else{
									matchFlag = pntStart.Equals(lineFromPnt);
									if(matchFlag){
//										isoline.AddPointInfo(lineFromPnt,0);
										isoline.AddPointInfo(lineToPnt,0);
//										isoline.FinishState = true;
//										alert("finish 2");
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
					var isoline = new IsolineInfo();  
					isoline.AddPointInfo(lineFromPnt);
					isoline.AddPointInfo(lineToPnt);
					
					if(lineFromPnt.IsEdge || lineToPnt.IsEdge){
						isoline.LineType = true;  //开放型等值线
					}
					listIsolines.push(isoline);
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