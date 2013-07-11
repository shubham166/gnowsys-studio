'use strict';

/* Handles most of the server interaction of list elements and its content and graph */
var rightInPanel, tablePanel;
var $list= function(){						//tableList data structure for holding all the elements in list panel	
	var that=Ox.TableList({
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
	  scrollbarVisible: true,
	  
            })
.bindEvent({
	select:select, change: select,
	});

that.getAjax = function(url)							//ajax call to get all the elements and filling the list
{
	$.ajax({
       	       		url:url,
			type : 'GET',
			dataurl : url,
	       		success: function(data){
			
			var items1 = JSON.parse(data);
	       		that.options({items:items1});
			
			     },
	      
   			});
	
return that;
}	


	return that;
}




var flag=0;
var id;
function select(data)							//list element select event handler
{		if(!flag)							//calls ajax2 to bring content and graph
		{								
		var $view=innerGroupButton();
		toolbar2.append($view);
	flag=1;
	}
	id = data.ids[0];
	switch(innerGrpId)
	{
		case 0:
			x= screen.width * 0.46;
			y = screen.width* 0.26;
			rightPanel.replaceElement(1, viewPanel= $viewPanel());
			var url="/ajax/Wikidetail/" + id;				
			getAjax2(url,id);
			break;

		case 1 :	
			x= screen.width * 0.48;
			y = screen.width/4;
			rightPanel.replaceElement(1, viewPanel= $viewPanel());
			var url="/ajax/Wikidetail/" + id;				
			getAjax2(url,id);
			break;

		case 2 :			//TODO ajax for for edit tab

		case 3:
			x= screen.width*3/4;
			y = 0;
			rightPanel.replaceElement(1, viewPanel= $viewPanel());
			var url="/ajax/Wikidetail/" + id;				;
			getAjax2(url,id);
			break;

		default :
			x= screen.width * 0.48;
			y = screen.width/4;
			rightPanel.replaceElement(1, viewPanel= $viewPanel());
			var url="/ajax/Wikidetail/" + id;				
			getAjax2(url,id);
			break;
	}
}


function getAjax2(url, id)						// brings content and graph of selected element of list
{
	$.ajax({
			url :url,
			type : 'GET',
			dataurl  : url,
			success: function(data){
				var items1 = JSON.parse(data);
				box1.html("<h1>" + items1[0].name + "</h1><hr>");
				var len=items1[0].name.toString().length;
				var tmp = document.createElement("DIV");
				tmp.innerHTML = items1[0].content;
				
				if(innerGrpId == 3)
					getGraph(id);
				else
					box2.html("<div class='divContent'> " + tmp.innerHTML + "</div>");

				var arr = items1[0].tags.map(function(t){	
					return Ox.extend({},  {
					tags	: t });
				});
				right2.options({items : arr});

				var arr1 = items1[0].prior_nodes.map(function(t){
					return Ox.extend({},  {
					prior_pages	: t });
				});	
				right1.options({items : arr1});
				}
			});
}

function getGraph(id){									//calling the fgraph method from getGraph.js
	box2.html("<div id='chart' style='height:600px; overflow-y:scroll'></div>");
		fgraph(id);
}


