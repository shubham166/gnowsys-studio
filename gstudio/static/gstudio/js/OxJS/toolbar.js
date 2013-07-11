'use strict';

var $toolbar = function(d,i){			//function to get different toolbars with parameters d(size)
		var that=Ox.Bar({size: d})		//and i for the id
                .attr({id: 'toolbar'+i});
		return that;

}
