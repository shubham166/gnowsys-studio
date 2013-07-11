'use strict';
/* Group button placed in rightInnerPanel */
var innerGroupButton = function(){
	var that = Ox.ButtonGroup({
		    buttons: [
		   {id:'view',title:'View',width:44},
		   {id:'edit',title:'Edit',width:40},
		   {id:'graphs',title:'Graphs',width:56},
		   {id:'history',title:'History',width:56},
		   {id:'discuss',title:'Discuss',width:56}
		],
		selectable:true,
		size:'large'
	
	})
	.bindEvent({change: click2});
	return that;
}

var innerGrpId =0;
function click2(data)							//click event handler
{
	if(data.title=='View')
	{
		x= 0.48 * screen.width;
		y = screen.width/4;
		rightPanel.replaceElement(1, viewPanel= $viewPanel());
		var url="/ajax/Wikidetail/" + id;				/*url containing selected element id */			      			getAjax2(url);							//to be sent as parameter to ajax call
		innerGrpId = 1;
		
	}
	else if(data.title=="Edit")
	{	
		//editText();							//edit functionality to be added here
		innerGrpId = 2;
	}
	else if(data.title=="Graphs")
	{
		innerGrpId=3;
		x = screen.width*3/4;
		y = 0;
		rightPanel.replaceElement(1,viewPanel=$viewPanel());	
		getGraph(id);							//calling getGraph method in list.js
	}

}
