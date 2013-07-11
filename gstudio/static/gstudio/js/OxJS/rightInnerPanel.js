'use strict';
//variabes declared
var box1,box2;

//panel used for the central place to display the title and information about the wikipage
var $rightInnerPanel =function(){
		var that=Ox.SplitPanel({
		elements: [	{element: box1=$box(1), size:34},
				{element: box2=$box(2), size: 20}
				
			],
			orientation:'vertical',
		
		
		});
		return that;
}
