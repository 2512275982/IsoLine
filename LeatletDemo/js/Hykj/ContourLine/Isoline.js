
function Isoline(grids) {
	//实例化isoline的时候为下面参数赋值
//	this.gridStep = 100; // 默认网格尺寸
	this.SplitArray = [8,9,10]; // new Array();
//	this.extendGridNum = 2; // 外扩网格个数

//	var originas = { // 提取原始数据，归纳分类
//		"x": new Array(),
//		"y": new Array(),
//		"z": new Array(),
//	};

//	if(data.length > 0) {
//		$.each(data, function(k, v) {
//			//首先对原始数据加偏
//			var coord = trans.PT([v.X, v.Y]);
//			originas.x.push(coord[0]);
//			originas.y.push(coord[1]);
//			originas.z.push(v.Value);
//		}); 
//	};

//	var Range_max_x = Math.max.apply(Math, originas.x);
//	var Range_max_y = Math.max.apply(Math, originas.y);
//	var Range_min_x = Math.min.apply(Math, originas.x);
//	var Range_min_y = Math.min.apply(Math, originas.y);

	this.action = function() { // 设置好各种参数之后，进行等值线分割

//		var gridLength = undefined;
//		var dy = Math.abs(Range_max_y - Range_min_y),
//			dx = Math.abs(Range_max_x - Range_min_x);
//
//		// 判断绘制最小网格方向
//		if(dx > dy) {
//			gridLength = dx / (this.gridStep - 1); // y最小 
//		} else {
//			gridLength = dy / (this.gridStep - 1); // x最小 
//		}
//
//		Range_min_x -= (gridLength * this.extendGridNum);
//		Range_min_y -= (gridLength * this.extendGridNum);
//
//		dx = dx + this.extendGridNum * gridLength * 2;
//		dy = dy + this.extendGridNum * gridLength * 2;

		/*
		 * 全局变量
		 */
//		var pointsArrys = new Array(); // 存储生成的内插点
		var pointsArrys = grids; // 存储生成的内插点
		var gridsArrys = new Array(); // 请勿修改该名字-------用来存储grid网格
		var isoLineObjArrys = {}; // 等值线存放数组 

		// 生成所有的内插点
//		for(var i = 0; i <= dx / gridLength; i++) {
//			var arr = new Array();
//			var x = Range_min_x + i * gridLength;
//			for(var j = 0; j <= dy / gridLength; j++) {
//				var y = Range_min_y + j * gridLength;
//				z = GetGridPntValue(x, y);
//				var pt = new Point(x, y, z, false);
//				arr.push(pt);
//			}
//			pointsArrys.push(arr);
//		}

		// build grid by pts
		for(var i = 0; i < pointsArrys.length - 1; i++) {
			var gridRows = new Array();
			for(var j = 0; j < pointsArrys[i].length - 1; j++) {
				var girdPtsArr = [
					// 从左上角顺时针旋转
					pointsArrys[i][j + 1], pointsArrys[i + 1][j + 1],
					pointsArrys[i + 1][j], pointsArrys[i][j],
				];
				var grid = new Grid(girdPtsArr);
				gridRows.push(grid);
			}
			gridsArrys.push(gridRows);
		}

		/*
		 * 根据等值线数组遍历所有的网格，填充网格信息
		 */
		for(var i = 0; i < this.SplitArray.length; i++) {
			var splitValue = this.SplitArray[i];
			isoLineObjArrys[splitValue] = new Array();
			for(var row = 0; row < gridsArrys.length; row++) {
				for(var colm = 0; colm < gridsArrys[row].length; colm++) {
					gridsArrys[row][colm].init(splitValue);
				}
			}
			/*
			 * 追踪当前数值的等值线
			 */
			// 开等值线
			for(var row = 0; row < gridsArrys.length; row++) {
				for(var colum = 0; colum < gridsArrys[row].length; colum++) {
					if(row == 0 || row == gridsArrys.length - 1 || colum == 0 || colum == gridsArrys[0].length - 1) { // 四个边界
						gridsArrys[row][colum].trendType = getInitTredType(row, colum);
						var gridLine = new Array(); // 网格追踪的等值线存放数组
						startLinePtsByRecursion.call(gridsArrys, gridLine, row, colum);
						if(gridLine.length !== 0) {
							var gridLinePts = transPointArrToLine(gridLine);
							isoLineObjArrys[splitValue].push(gridLinePts);
						}
					}
				}
			}

			/*
			 * 闭合等值线
			 * 先遍历完成开等值线，然后遍历剩余的没有经过的网格(5、10这两种情况没有把他们设置为true,仍然是false的状态，当所有的网格都遍历过后，即使这两个仍然没有访问，根据他们单一网格也不能生成等值线)
			 * 简言之，5、10两种状态对生成闭合等值线没有影响
			 */
			for(var row = 0; row < gridsArrys.length; row++) {
				for(var colum = 0; colum < gridsArrys[row].length; colum++) {
					if(!gridsArrys[row][colum].isTraveled) { // 判断当前网格是否已经遍历过了
						// 从底端一层层的向上、向右遍历网格
						switch(gridsArrys[row][colum].gridType) {
							//好像从左下方起始的等值线状态只有4.10两种情况？？？---暂时按照这样写看看吧
							//上述的写法不对。。。有好几个较小的圆没有生成闭合曲线	
							case 0:
								continue;
							case 1:
							case 14:
								gridsArrys[row][colum].trendType = 3;
								break;
							case 2:
							case 13:
								gridsArrys[row][colum].trendType = 1;
								break;
							case 3:
							case 12:
								gridsArrys[row][colum].trendType = 3;
								break;
							case 4:
							case 11:
								gridsArrys[row][colum].trendType = 0;
								break;
							case 6:
							case 9:
								gridsArrys[row][colum].trendType = 0;
								break;
							case 7:
							case 8:
								gridsArrys[row][colum].trendType = 0;
								break;
							default:
								continue;
								break;
						}
						var gridLine = new Array(); // 网格追踪的等值线存放数组  
						getCycleLineFromBegin.call(gridsArrys, gridLine, row, colum);
						if(gridLine.length !== 0) {
							var gridLinePts = transClosePointArrToLine(gridLine);
							isoLineObjArrys[splitValue].push(gridLinePts);
						}
					}
				}
			}
		}

		/*
		 * 返回等值线对象
		 */
		return isoLineObjArrys;

		function transClosePointArrToLine(arr) {
			// 选取所有数据的末尾点和第一个数据的起始点
			var linePoint = transPointArrToLine(arr);
			linePoint.pop();
			return linePoint;
		}

		function transPointArrToLine(arr) {
			// 选取所有数据的末尾点和第一个数据的起始点
			var linePoint = new Array();
			linePoint.push([arr[0][0].y, arr[0][0].x]);
			arr.forEach(function(item) {
				linePoint.push([item[1].y, item[1].x]);
			})
			return linePoint;
		}

		function getInitTredType(row, colum) {
			if(row == 0) {
				return 3;
			} else if(row == gridsArrys.length - 1) {
				return 1;
			} else if(colum == 0) {
				return 2;
			} else {
				return 0;
			}
		}

		/*
		 * 4个参数分别是存储的等值线点，起始点和递归的下一个点
		 */
		function getCycleLineFromBegin(linePointArr, a, b) {
			var flag = false;
			// 3--左侧的线段
			if(this[a][b].trendType == 3) {
				switch(this[a][b].gridType) { //
					case 0:
					case 15:
						break;
					case 1:
					case 14:
						this[a][b].isTraveled = true;
					case 10:
						linePointArr.push([this[a][b].pURDL[3], this[a][b].pURDL[2]]);
						flag = true;
						b -= 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
						this[a][b].trendType = 0;
						break;
					case 3:
					case 12:
						linePointArr.push([this[a][b].pURDL[3], this[a][b].pURDL[1]]);
						this[a][b].isTraveled = true;
						flag = true;
						a += 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
						this[a][b].trendType = 3;
						break;
					case 7:
					case 8:
						this[a][b].isTraveled = true;
					case 5:
						linePointArr.push([this[a][b].pURDL[3], this[a][b].pURDL[0]]);
						flag = true;
						b += 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
						this[a][b].trendType = 2;
						break;
					default:
						break;
				}
			}

			// 2--底端的线段
			else if(this[a][b].trendType == 2) {
				switch(this[a][b].gridType) {
					case 0:
					case 15:
						break;
					case 1:
					case 14:
						this[a][b].isTraveled = true;
					case 10:
						linePointArr.push([this[a][b].pURDL[2], this[a][b].pURDL[3]]);
						flag = true;
						a -= 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b ==  gridsArrys[0].length) return;
						this[a][b].trendType = 1;
						break;
					case 2:
					case 13:
						this[a][b].isTraveled = true;
					case 5:
						linePointArr.push([this[a][b].pURDL[2], this[a][b].pURDL[1]]);
						flag = true;
						a += 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
						this[a][b].trendType = 3;
						break;
					case 6:
					case 9:
						linePointArr.push([this[a][b].pURDL[2], this[a][b].pURDL[0]]);
						this[a][b].isTraveled = true;
						flag = true;
						b += 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b ==  gridsArrys[0].length) return;
						this[a][b].trendType = 2;
						break;
					default:
						break;
				}
			}

			// 1--右端的线段
			else if(this[a][b].trendType == 1) {
				switch(this[a][b].gridType) {
					case 0:
					case 15:
						break;
					case 2:
					case 13:
						this[a][b].isTraveled = true;
					case 5:
						linePointArr.push([this[a][b].pURDL[1], this[a][b].pURDL[2]]);
						flag = true;
						b -= 1;
						if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
							return;
						this[a][b].trendType = 0;
						break;
					case 3:
					case 12:
						linePointArr.push([this[a][b].pURDL[1], this[a][b].pURDL[3]]);
						this[a][b].isTraveled = true;
						flag = true;
						a -= 1;
						if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
							return;
						this[a][b].trendType = 1;
						break;
					case 4:
					case 11:
						this[a][b].isTraveled = true;
					case 10:
						linePointArr.push([this[a][b].pURDL[1], this[a][b].pURDL[0]]);
						flag = true;
						b += 1;
						if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
							return;
						this[a][b].trendType = 2;
						break;
					default:
						break;
				}
			}

			// 0--顶端的线段
			else if(this[a][b].trendType == 0) {
				switch(this[a][b].gridType) { //
					case 0:
					case 15:
						break;
					case 4:
					case 11:
						this[a][b].isTraveled = true;
					case 10:
						linePointArr.push([this[a][b].pURDL[0], this[a][b].pURDL[1]]);
						flag = true;
						a += 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b ==  gridsArrys[0].length) return;
						this[a][b].trendType = 3;
						break;
					case 7:
					case 8:
						this[a][b].isTraveled = true;
					case 5:
						linePointArr.push([this[a][b].pURDL[0], this[a][b].pURDL[3]]);
						flag = true;
						a -= 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
						this[a][b].trendType = 1;
						break;
					case 6:
					case 9:
						linePointArr.push([this[a][b].pURDL[0], this[a][b].pURDL[2]]);
						this[a][b].isTraveled = true;
						flag = true;
						b -= 1;
						// if(a < 0 || b < 0 || a == gridsArrys.length || b ==  gridsArrys[0].length) return;
						this[a][b].trendType = 0;
						break;
					default:
						break;
				}
			}
			// 追踪下一个网格点
			if(flag) {
				if(linePointArr.length > 2 &&
					(linePointArr[0][0].x == linePointArr[linePointArr.length - 1][0].x) &&
					(linePointArr[0][0].y == linePointArr[linePointArr.length - 1][0].y)) {

				} else {
					getCycleLineFromBegin.call(this, linePointArr, a, b);
				}
			}

		}

		function startLinePtsByRecursion(linePointArr, a, b) {
			var flag = false;
			// 首先判断该网格点是否被访问
			if((!this[a][b].isTraveled) && (a >= 0 && a < gridsArrys.length) &&
				(b >= 0 && b < gridsArrys[a].length)) { // 该网格点没有被访问

				// 3--左侧的线段
				if(this[a][b].trendType == 3) {
					switch(this[a][b].gridType) { //
						case 0:
						case 15:
							break;
						case 1:
						case 14:
							this[a][b].isTraveled = true;
						case 10:
							linePointArr.push([this[a][b].pURDL[3], this[a][b].pURDL[2]]);
							flag = true;
							b -= 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
								return;
							this[a][b].trendType = 0;
							break;
						case 3:
						case 12:
							linePointArr.push([this[a][b].pURDL[3], this[a][b].pURDL[1]]);
							this[a][b].isTraveled = true;
							flag = true;
							a += 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
								return;
							this[a][b].trendType = 3;
							break;
						case 7:
						case 8:
							this[a][b].isTraveled = true;
						case 5:
							linePointArr.push([this[a][b].pURDL[3], this[a][b].pURDL[0]]);
							flag = true;
							b += 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
								return;
							this[a][b].trendType = 2;
							break;
						default:
							break;
					}
				}

				// 2--底端的线段
				else if(this[a][b].trendType == 2) {
					switch(this[a][b].gridType) {
						case 0:
						case 15:
							break;
						case 1:
						case 14:
							this[a][b].isTraveled = true;
						case 10:
							linePointArr.push([this[a][b].pURDL[2], this[a][b].pURDL[3]]);
							flag = true;
							a -= 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
								return;
							this[a][b].trendType = 1;
							break;
						case 2:
						case 13:
							this[a][b].isTraveled = true;
						case 5:
							linePointArr.push([this[a][b].pURDL[2], this[a][b].pURDL[1]]);
							flag = true;
							a += 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
								return;
							this[a][b].trendType = 3;
							break;
						case 6:
						case 9:
							linePointArr.push([this[a][b].pURDL[2], this[a][b].pURDL[0]]);
							this[a][b].isTraveled = true;
							flag = true;
							b += 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length)
								return;
							this[a][b].trendType = 2;
							break;
						default:
							break;
					}
				}

				// 1--右端的线段
				else if(this[a][b].trendType == 1) {
					switch(this[a][b].gridType) {
						case 0:
						case 15:
							break;
						case 2:
						case 13:
							this[a][b].isTraveled = true;
						case 5:
							linePointArr.push([this[a][b].pURDL[1], this[a][b].pURDL[2]]);
							flag = true;
							b -= 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
							this[a][b].trendType = 0;
							break;
						case 3:
						case 12:
							linePointArr.push([this[a][b].pURDL[1], this[a][b].pURDL[3]]);
							this[a][b].isTraveled = true;
							flag = true;
							a -= 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
							this[a][b].trendType = 1;
							break;
						case 4:
						case 11:
							this[a][b].isTraveled = true;
						case 10:
							linePointArr.push([this[a][b].pURDL[1], this[a][b].pURDL[0]]);
							flag = true;
							b += 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
							this[a][b].trendType = 2;
							break;
						default:
							break;
					}
				}

				// 0--顶端的线段
				else if(this[a][b].trendType == 0) {
					switch(this[a][b].gridType) { //
						case 0:
						case 15:
							break;
						case 4:
						case 11:
							this[a][b].isTraveled = true;
						case 10:
							linePointArr.push([this[a][b].pURDL[0], this[a][b].pURDL[1]]);
							flag = true;
							a += 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
							this[a][b].trendType = 3;
							break;
						case 7:
						case 8:
							this[a][b].isTraveled = true;
						case 5:
							linePointArr.push([this[a][b].pURDL[0], this[a][b].pURDL[3]]);
							flag = true;
							a -= 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
							this[a][b].trendType = 1;
							break;
						case 6:
						case 9:
							linePointArr.push([this[a][b].pURDL[0], this[a][b].pURDL[2]]);
							this[a][b].isTraveled = true;
							flag = true;
							b -= 1;
							if(a < 0 || b < 0 || a == gridsArrys.length || b == gridsArrys[0].length) return;
							this[a][b].trendType = 0;
							break;
						default:
							break;
					}
				}
				// 追踪下一个网格点
				if(flag) {
					cycleForLine.call(this, linePointArr, a, b);
				}
			}
		}

		/*
		 * 根据当前的grid进入方向，判断出下一个grid的进入方向
		 */
		function getOutDirection(grid) {
			var currentDirection = grid.gridType;
			var pURDL = grid.pURDL;
			switch(currentDirection) {
				case 0:
					if(pURDL[0] && pURDL[1] && pURDL[2] && pURDL[3]) {
						if(grid.trendType == 5) {
							return 1;
						} else { // 10
							return 3;
						}
					} else if(pURDL[1]) {
						return 3;
					} else if(pURDL[2]) {
						return 0;
					} else if(pURDL[3]) {
						return 1;
					}
					break;
				case 1:
					if(pURDL[0] && pURDL[1] && pURDL[2] && pURDL[3]) {
						if(grid.trendType == 5) {
							return 0;
						} else { // 10
							return 2;
						}
					} else if(pURDL[0]) {
						return 3;
					} else if(pURDL[2]) {
						return 0;
					} else if(pURDL[3]) {
						return 1;
					}
					break;
				case 2:
					if(pURDL[0] && pURDL[1] && pURDL[2] && pURDL[3]) {
						if(grid.trendType == 5) {
							return 3;
						} else { // 10
							return 1;
						}
					} else if(pURDL[0]) {
						return 2;
					} else if(pURDL[1]) {
						return 3;
					} else if(pURDL[3]) {
						return 1;
					}
					break;
				case 3:
					if(pURDL[0] && pURDL[1] && pURDL[2] && pURDL[3]) {
						if(grid.trendType == 5) {
							return 2;
						} else { // 10
							return 0;
						}
					} else if(pURDL[0]) {
						return 2;
					} else if(pURDL[1]) {
						return 3;
					} else if(pURDL[2]) {
						return 0;
					}
					break;
				default:
					break;
			}
		}

		// 根据当前网格获取下一个网格
		function cycleForLine(linePointArr, a, b) {
			// this仍是网格组
			startLinePtsByRecursion.call(gridsArrys, linePointArr, a, b)
		}
	}
};