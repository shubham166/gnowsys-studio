'use strict';

var list1;
var $listPanel = function(){
	var that=Ox.SplitPanel({
	elements :[
		{element : $findBox() , size :  screen.height/40},
		{element : list1 = $list() , size : (screen.height*0.8144)-(screen.height/40)}
	],
	orientation : 'vertical'
	})
	});
return that;
}
