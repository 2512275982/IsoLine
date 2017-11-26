/*
 * 网格生成类，用于网格插值
 * 作者：maxiaoling
 * 创建日期：2017.11.20
 * 插值方法：
 * 1、反距离权重法 2017.11.20
 */
var GridClass = {
	createNew: function(listPoints) {
		var gridsInfo = {};
		var listOriginPnts = listPoints;
		
		var gridStep = 150; //-----------该个数与等值线的生成个数应该一致，修改的时候请一同修改(包括下面的外扩个数)
		var extendGridNum = 2;
		
		var originas = { //提取数据，归纳分类
			"x": new Array(),
			"y": new Array(),
			"z": new Array(),
		};
		/*
		 * 根据原始的点数据，插值构造网格矩阵
		 * 网格数默认为100，可以调参数，网格数越多步数越小，生成的等值线越平滑
		 */
		gridsInfo.GetGrids = function() {
			var pntGrid = new Array();
			var yMax = -1,
				yMin = -1,
				xMax = -1,
				xMin = -1;

			$.each(listOriginPnts, function(i, item) {
				originas.x.push(item.X)
				originas.y.push(item.Y)
				originas.z.push(item.Value)
			});

			yMax = Math.max.apply(Math, originas.y);
			yMin = Math.min.apply(Math, originas.y);
			xMax = Math.max.apply(Math, originas.x);
			xMin = Math.min.apply(Math, originas.x);

			var dx = xMax - xMin;
			var dy = yMax - yMin;

			var step = 0;
			if(dx > dy) {
				step = 1.0 * dx / (gridStep - 1);
			} else {
				step = 1.0 * dy / (gridStep - 1);
			}

			xMin = xMin - extendGridNum * step;
			yMin = yMin - extendGridNum * step;

			dx = dx + extendGridNum * step * 2;
			dy = dy + extendGridNum * step * 2;

			pntGrid.splice(0, pntGrid.length);

			for(var i = 0; i <= dx / step; i++) {
				var gridArray = new Array();
				var x = xMin + i * step;
				for(var j = 0; j <= dy / step; j++) {
					var y = yMin + j * step;
					var value = GetGridPntValue(x, y);
					var pnt = new PointInfo(x, y, value);
					gridArray.push(pnt);
				}
				pntGrid.push(gridArray);
			}
			return pntGrid;
		};

		/*
		 * 插值取网格值，返回网格值
		 * 反距离权重法
		 */
		var GetGridPntValue = function(lon, lat) {
			var valueSum = 0;
			var disSum = 0;
			listOriginPnts.forEach(function(item) {
				var dis2 = Math.pow((item.X - lon), 2) + Math.pow((item.Y - lat), 2);
				disSum += 1 / dis2;
				valueSum += 1 / dis2 * item.Z;
			})
			var gridValue = valueSum / disSum;
			return gridValue;
		};
		return gridsInfo;
	}
};