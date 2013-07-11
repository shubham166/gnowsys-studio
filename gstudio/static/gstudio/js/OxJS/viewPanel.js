'use strict';
var x= screen.width*3/4 , y =0;				//initializing the global variables 
var $viewPanel = function()
{
	var that = Ox.SplitPanel({
		elements : [
		{element : $rightInnerPanel(), size:x},			//parameters x & y passed to get different sizes
		{element : $tablePanel(),  size:y}				//on different events
		],
		orientation : 'horizontal'
	});
	return that;

}
