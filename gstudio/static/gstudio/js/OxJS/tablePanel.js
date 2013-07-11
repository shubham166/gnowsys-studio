'use strict';


var prior, tags, posterior;				//global variables
var $tablePanel = function(){
	var that = Ox.SplitPanel({				//panel used for adding the different panels on the extreme right
		elements : [
		{element : prior = $priorPanel(), 			//initializing the panel 
		size : 0.272*screen.height},				//specifying the size relative to the screen size

		{element : tags =  $tagsPanel(), 
		size :0.272*screen.height},

		{element : posterior = $posteriorPanel(),	
		size :0.272*screen.height}
	],
		orientation : 'vertical'
		
	});
	return that;
}
