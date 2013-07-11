'use strict';

var $list1 = Ox.TableList({
	  id:102,
	  columns:[
	  {
	      id:'id',
	      title:'ID',
	      operator:'+',
	      visible:true,
	      resizable : true
	  },
	  {
	      id:'name',
	      title:'Name',
	      operator:'+',
	      visible:true,
	      resizable : true
	  }
	  ],
	  items:[],
	  unique:'id',
	  // scrollbarVisible: true,
	  
            })
.bindEvent({
	select:select, change: select,
	});

getAjax = function(url)
{
	$.ajax({
       	       		url:url,
	       		success: function(data){
			//console.log("data " + data);
			
			var items1 = JSON.parse(data);
		//	$heading =items1[0].name;
			console.log("items " + items1[1].name);

	       		that.options({items:items1});
			
//			$heading = dat
		//	console.log("Heading at ajax " + $heading);
			     },
	      
   			});
	
}	





var flag=0;
var id;
function select(data)
{	//var c  = $list.selected[0];
	/*alert("dkjxnck");
		if(!flag)
		{
		$view=Ox.ButtonGroup({
		    buttons: [
		   {id:'view',title:'View',width:44},
		   {id:'edit',title:'Edit',width:40},
		   {id:'graphs',title:'Graphs',width:56},
		   {id:'history',title:'History',width:56},
			{id:'discuss',title:'Discuss',width:56}
		],
		selectable:false,
		size:'large'
	
	})
	.bindEvent({click: click2})
	.appendTo($toolbar2);
	flag=1;

	id = data.ids[0];
	var url="/ajax/Wikidetail/" + id;
		console.log(url);
		getAjax2(url);
	}
	
	else
	{
	id = data.ids[0];
	var url="/ajax/Wikidetail/" + id;
		console.log(url);
		getAjax2(url);
	}
	//$right1.options({visible:true});
	//$right2.options({visible:true});
	//$right3.options({visible:true});*/

	
}

