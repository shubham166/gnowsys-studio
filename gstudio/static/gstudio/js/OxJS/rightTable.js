'use strict';

var idRight1;					//global variable used to specify the id used in getDelAjax()


//three table lists specified for displaying the relations of a particular wikipage with others
var $rightTable1=function(){
		var that=Ox.TableList({
		id:'prior_pages',
		columns: [
			{id:'prior_pages', title:'Prior Pages', operator:'+',visible:true}],
		scrollbarVisible:true,
		items:[],
		unique:'prior_pages',
			
	}).bindEvent({select : function(data){
		idRight1 = data.ids[0];				//initializing the global variable
		}});
	return that;
}	


var $rightTable2=function(){
		var that=Ox.TableList({
		id:'tags',
		columns: [{id:'tags', title:'Tags', operator:'+',visible:true}],	
		scrollbarVisible:true,
		items:[],
		unique:'tags'
	
	}).bindEvent({select : function(data){
		idRight1 = data.ids[0];
		
		}});
	return that;
}	

var $rightTable3=function(){
		var that=Ox.TableList({
		id:'posterior_pages',
		columns: [{id:'posterior_pages', title:'Posterior Pages', operator:'+',visible:true}],	
		scrollbarVisible:true,
		items:[],
		unique:'posterior_pages',
	
	}).bindEvent({select : function(data){
		idRight1 = data.ids[0];
		alert(idRight1);
		}});
	return that;
}	

var $rightTable4=function(){			//not used
		var that=Ox.TableList({
		id:'existing_relations',
		columns: [{id:'existing_relations', title:'Existing Relations', operator:'+',visible:true}],
		//columnsVisible:true,		
		scrollbarVisible:true,
		items:[],
		unique:'existing_relations',
		//visible: false
	
	}).bindEvent({select : function(data){
		idRight1 = data.ids[0];
		alert(idRight1);
		}});
	return that;
}	
