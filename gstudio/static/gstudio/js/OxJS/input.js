'use strict';

var $input=function(){
		var that=Ox.Input({width:276,placeholder:'Add'})
			.bindEvent({
			submit : function(){
			var url = "/ajax/AddTag/";
			postAjax(url); 		
			}				
		});
		return that;
}

function postAjax(url)
{
	alert("check"+id);
	$.ajax({
			type :'GET',	
			url : url ,
			data : {id1:id,id2:input1.options('value')},
			success: function(data){alert(data);},
		   	error : function(){alert("error");}
	});
}
