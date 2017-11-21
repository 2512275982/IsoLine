var TrackLineMClass = {
	layerId:'trackLine',
	createNew: function(){
		var trackLine = {};
		var trackLineLayer = L.featureGroup([]);
		
		var LineDefault = {
	        color:'#FF83FA',
		};
		/*
		 * 清除trackLayer中的数据
		 */
		trackLine.clearLayerInfos = function(){
			trackLineLayer.clearLayers();
		};
		/*
		 * 新建一个trackLayer图层返回回去，尝试操作该模块的全局变量
		 */
		trackLine.getTrackLineLayer = function(){
			return trackLineLayer;	
		};
		
		trackLine.addTrackLineToLayer = function(type){
			var line = '[{"UTR_LONGITUDE":115.039814,"UTR_LATITUDE":34.87113,"UTR_ID":"64b9c4f913894eee842b547f3dc7a0bf","UTR_POSITION_TIME":1487037480000},{"UTR_LONGITUDE":115.040804,"UTR_LATITUDE":34.87217,"UTR_ID":"764f39db61f7453dad96794116c523e0","UTR_POSITION_TIME":1487037480000},{"UTR_LONGITUDE":115.041814,"UTR_LATITUDE":34.87322,"UTR_ID":"a932dd0e98fe46b3975a674fe0939cfd","UTR_POSITION_TIME":1487037480000},{"UTR_LONGITUDE":115.042844,"UTR_LATITUDE":34.8743,"UTR_ID":"5a4b26f5d8574375ba9349229e6fb2e0","UTR_POSITION_TIME":1487037480000},'+
					'{"UTR_LONGITUDE":115.043834,"UTR_LATITUDE":34.87536,"UTR_ID":"3f579241b7924a5c91a750bc66667023","UTR_POSITION_TIME":1487037480000},'
					+'{"UTR_LONGITUDE":115.044844,"UTR_LATITUDE":34.8764,"UTR_ID":"374b37870c684196bd222dd07d2ea97a","UTR_POSITION_TIME":1487037540000},'
					+'{"UTR_LONGITUDE":115.045834,"UTR_LATITUDE":34.87746,"UTR_ID":"27439ca1719f42c496202a22836fa5c2","UTR_POSITION_TIME":1487037540000},'
					+'{"UTR_LONGITUDE":115.046994,"UTR_LATITUDE":34.87848,"UTR_ID":"d49487a972894ef8a5f28ba00f140e3d","UTR_POSITION_TIME":1487037540000},'
					+'{"UTR_LONGITUDE":115.048144,"UTR_LATITUDE":34.87945,"UTR_ID":"a9aadfeed345490c9f5924ee87593658","UTR_POSITION_TIME":1487037540000},'
					+'{"UTR_LONGITUDE":115.049284,"UTR_LATITUDE":34.88039,"UTR_ID":"0749bc43acb1496c89a4fa3597344c89","UTR_POSITION_TIME":1487037540000},'
					+'{"UTR_LONGITUDE":115.050434,"UTR_LATITUDE":34.88136,"UTR_ID":"cbd47b2c5d874dd9b267dda5ae8078d2","UTR_POSITION_TIME":1487037540000}]';
			obj = JSON.parse(line);
			if(!$.isEmptyObject(obj)) {
				var coordArry = [];
				obj.map(function(value, index) {
					var coord = [value['UTR_LATITUDE'], value['UTR_LONGITUDE']];
					coord = trans.PT(coord);
					coordArry.push(coord);
					if(type === 1){
						trackLineLayer.addLayer(L.marker(coord));
					}					
				})
				trackLineLayer.addLayer(L.polyline(coordArry,LineDefault));
			}
		};
　　　　　　 return trackLine;
　　　}
};