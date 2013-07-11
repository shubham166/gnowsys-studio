'use strict';

var $tabButton = function(){
		var that=Ox.ButtonGroup({			//groupbuttons used for editing the links to the particular wikipage
		buttons :[
			{id:'add', title :'Add', tooltip : 'Add new Element'},
			{id:'edit', title :'Edit', tooltip : 'Edit Element'},
			{id:'del', title :'Delete', tooltip : 'Delete Element'}],
			size : 'small',
			type : 'image',				//to display images and not the title
			selectable:true
		})
		.bindEvent({change: click3})		//event handler
		.addClass("prior");					//class added for positioning in css to the right
		return that;
}

function getDelAjax(url)					//function for deleting a node from the list
{
	$.ajax({
			type :'GET',	
			url : url ,
			data : {id1:id,id2:idRight1},
			//data: {id1:id , id2 :},
			//id2:$input2.options('value'),
			success: function(data){alert(data);
						alert("success")},
		   	 error : function(){alert("error");}
	});
}



function click3(data)					//function for the event 'change'
{
	if(data.title=='Add')
	{
			
	}
	else if(data.title=='Edit')
	{

	}
	
	else if(data.title=='Delete')
	{	
		var url = '/ajax/delPrior/';	//url specified
		alert("delete node");			
		getDelAjax(url);				//function call for deletion
	}
}
