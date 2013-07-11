'use strict';

var $userButtons = function(){
	var that = Ox.ButtonGroup({						//set of buttons for user-login and registration
		buttons : [
		{id: 'signin', title : "Sign In"},				
		{id: 'register', title : 'Register'}	
	],
				
	})
	.addClass('prior');				//class added for css to get it to the right of topGroupButtons
	
	return that;
}
