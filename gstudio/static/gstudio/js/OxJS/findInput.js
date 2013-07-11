'use strict';
/* findbox to search for element in the list in listPanel */
var $findBox =function(){
	var that= Ox.Input({
		changeOnKeypress :true,
		clear :true,
		placeholder: 'Find',
		width : 350
	}).bindEvent({
		change : find
	});

function find(){							//oxjs inbuilt find query 
	var query = getQuery();
	list1.options({query : query});

}

function getQuery(){	
	var query = {
		conditions :[{key : 'name' , operator : '=' , value : that.options('value')}]
	};
	return query;	
}
	return that;
}	
