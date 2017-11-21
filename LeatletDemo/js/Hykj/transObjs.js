var trans = function() {

	//判断两个多边形是否相交
	var isIntersect = function(polygA, polygB) {
		var flag = false;
		var interPolyg = turf.intersect(polygA, polygB);
		//相交可能会生成多边形、线、点、undefined
		if(interPolyg) {
			if(interPolyg.geometry.type == "Polygon") { //只有当返回值为多边形的时候，才说明相交
				flag = true
			}
		}
		return flag;
	}

	//将单个点纠偏
	var transPT = function(arr) {
		if(arr.length == 2) {
			if(arr[0] > 100) {
				return coordtransform.wgs84togcj02(arr[0], arr[1])
			} else {
				return coordtransform.wgs84togcj02(arr[1], arr[0]).reverse()
			}
		} else {
			return null;
		}
	}

	//将多边形进行纠偏------------原理：依次将传进来的数组中每个元素进行偏移
	var transPTs = function(arrs) { //arrs是单点的集合【[],[]】
		for(var i = 0; i < arrs.length; i++) {
			arrs[i] = transPT(arrs[i]);
		}
		return arrs
	}

	//提取BLH中需要的BL数据
	var BLHtoLatLon = function(coordOBj) {
		return [coordOBj['B'], coordOBj['L']];
	}

	return {
		PT: transPT,
		PTs: transPTs,
		blh_LatLon: BLHtoLatLon,
		isIntersect: isIntersect,
	}
}()