/*
 * 网格生成类，用于网格插值
 * 作者：maxiaoling
 * 创建日期：2017.11.20
 * 插值方法：
 * 1、反距离权重法 2017.11.20
 */
var DelauneyClass = {
	createNew: function(listPoints) {
		var delauneyInfo = {};
		var xMax,xMin,yMax,yMin;
		
		var SuperTriangle = function(vertices){
			var xmin = Number.POSITIVE_INFINITY,
	        ymin = Number.POSITIVE_INFINITY,
	        xmax = Number.NEGATIVE_INFINITY,
	        ymax = Number.NEGATIVE_INFINITY,
	        i, dx, dy, dmax, xmid, ymid;
	
		    for(i = vertices.length; i--; ) {
		      if(vertices[i][0] < xmin) xmin = vertices[i][0];
		      if(vertices[i][0] > xmax) xmax = vertices[i][0];
		      if(vertices[i][1] < ymin) ymin = vertices[i][1];
		      if(vertices[i][1] > ymax) ymax = vertices[i][1];
		    }
		
		    dx = xmax - xmin;
		    dy = ymax - ymin;
		    dmax = Math.max(dx, dy);
		    xmid = xmin + dx * 0.5;
		    ymid = ymin + dy * 0.5;
		
		    return [
		      [xmid - 20 * dmax, ymid -      dmax],
		      [xmid            , ymid + 20 * dmax],
		      [xmid + 20 * dmax, ymid -      dmax]
		    ];
		};
		
		
		return delauneyInfo;
	}
}