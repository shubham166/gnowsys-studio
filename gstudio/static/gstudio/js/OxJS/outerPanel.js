'use strict';
var toolbar1;		//variable declared

//The main Panel initialized in index.html carrying all other panels
		var $outerPanel = function(){

		var that = Ox.SplitPanel({
		elements : [
			{
				 element:$menuToolbar().append($mainMenu()).append($userButtons()) ,
					size: 0.028*screen.height
			},
			{element : toolbar1=$toolbar(0.0396*screen.height,1).append($menu()).append($themeButtons()),size:0.0396*screen.height},
			{element:$innerPanel(),size:0.8144*screen.height}
		],
		orientation : 'vertical'		
	});
	return that;
}
			

