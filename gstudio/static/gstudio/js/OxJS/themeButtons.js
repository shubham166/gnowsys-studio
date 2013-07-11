'use strict';

var $themeButtons = function(){			//used for different themes
	var that = Ox.ButtonGroup({
		buttons : [
		{id : 'light', title : 'Light'},
		{id : 'medium', title : 'Medium'},
		{id : 'dark' , title : 'Dark'}
		],
		selectable : true,
		//addClass : 'themeButtonCss',
		//size : 'large'
	})
	.addClass('prior')					//class added for positioning in css
	.bindEvent({
		change : function(data)			//event handler
		{
			if(data.title == 'Light') 			//themes implemented for different button selections
			{
				Ox.Theme('oxlight');
			}
			if(data.title == 'Medium') 			
			{
				Ox.Theme('oxmedium');
			}
			if(data.title == 'Dark') 			
			{
				Ox.Theme('oxdark');
			}	
				
		}
	});
		
	return that;
}


