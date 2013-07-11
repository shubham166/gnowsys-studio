'use strict';

//variables declared
var toolbar3, toolbar4, toolbar5;
var input1, input2, input3;
var right1, right2, right3;

//panels made for the relations being displayed in a list format
var $priorPanel=function(){
		var that=Ox.SplitPanel({
		elements:[
			{element:toolbar3=$toolbar(screen.height/35,3).append($box(3).html("<b>Prior Pages</b>").addClass("prior1")).append($tabButton()),size:screen.height/35},
			{element:input1=$input(),size:screen.height/45},
			{element:right1=$rightTable1(),size:0.217*screen.height} 
				],
			orientation:'vertical'
		});
		return that;
}

var $tagsPanel=function(){
		var that=Ox.SplitPanel({
		elements:[
			{element:toolbar4=$toolbar(screen.height/35,4).append($box(4).html("<b>Tags</b>").addClass("prior1")).append($tabButton()),size:screen.height/35},
			{element:input2=$input(),size:screen.height/45},
			{element:right2=$rightTable2(),size:0.217*screen.height} 
				],
			orientation:'vertical'
		});
		return that;
}

var $posteriorPanel=function(){
		var that=Ox.SplitPanel({
		elements:[
			{element:toolbar5=$toolbar(screen.height/35,5).append($box(5).html("<b>Posterior Pages</b>").addClass("prior1")).append($tabButton()),size:screen.height/35},
			{element:input3=$input(),size:screen.height/45},
			{element:right3=$rightTable3(),size:0.217*screen.height} 
				],
			orientation:'vertical'
		});
		return that;
}
