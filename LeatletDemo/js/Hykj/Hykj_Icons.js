/*目前Icon样式定义写在JS文件中，以后可以改写到css文件中*/
var IconModule = (function(){
	var LeafIcon = L.Icon.extend({
	    options: {
	        shadowUrl: '../img/icons/EnterpriseIcon/blue.png',
	        iconSize:     [22, 24],  //38, 95
	        shadowSize:   [50, 64],
	        iconAnchor:   [22, 94],
	        shadowAnchor: [4, 62],
	        popupAnchor:  [-3, -76]
	    }
	});
	
	var enterpriseIcon = {};
	enterpriseIcon.Default = new LeafIcon({iconUrl: './img/icons/EnterpriseIcon/blue.png'});
	enterpriseIcon.Red = new LeafIcon({iconUrl: './img/icons/EnterpriseIcon/red.png'});
	enterpriseIcon.Gray = new LeafIcon({iconUrl: './img/icons/EnterpriseIcon/gray.png'});
	    
    var getEnterpriseIcon = function(colorType){
    	var icon = enterpriseIcon.Default;
    	switch(colorType){
    		case 'red':
    			icon = enterpriseIcon.Red;
    			break;
    		case 'gray':
    			icon = enterpriseIcon.Gray;
    			break;	
    	}
    	return icon;
    };
    
    return{
    	getEnterpriseIcon:getEnterpriseIcon
    }
})();
