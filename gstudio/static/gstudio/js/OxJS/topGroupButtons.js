'use strict';

var $menu= function(){
		var that=Ox.ButtonGroup({							//buttons used for the main categories on the page
                buttons: [
                    {id: '1', title: 'Home', tooltip: ''},
                    {id: '2', title: 'Loom', tooltip: ''},
	            {id: '3', title: 'WikiPages', tooltip: ''},
                    {id: '4', title: 'Documents', tooltip: ''},
	            {id: '5', title: 'Videos', tooltip: ''},
	            {id: '6', title: 'Images', tooltip: ''}
                ],
		 selectable: true,
		size:'large'

})	
	    .addClass('prior1')							//class added to bind this with userButtons and get them to the right
	    .bindEvent({change : click1})				//event handler
	return that;
}
var url;								//global variable 
function click1(data)					//function for the event 'change'
{
	
	if (data.title=="WikiPages")
	{
		
		url="/ajax/Wikilist";		//specific urls for diffferent buttons for ajax calls
		list1.getAjax(url);			//getAjax function called for the given url
		
	}

	if(data.title=="Loom")
	{
	  url="/ajax/LoomThread";
	  list1.getAjax(url);
	
	  
	}
	
	if(data.title =='Documents')
	{
		alert("graph");	
		getGraph();
		
	}
}

function trial()
{
	$list().getAjax(url)
}
