'use strict';

//menu bar attributes defined in the function
//TODO adding keyboard shortcuts
var $mainMenu =  function(){
		var that = Ox.MainMenu({
                menus: [
                    {id: 'file', title: 'File', items : [
				{id:'home', title:'Home',keyboard :'alt control j'},
				
			]},
		    {id: 'edit', title: 'Edit',items : [
			{id: 'hideSidebar', title:'Hide Sidebar'},
			{id : 'hideFilter', title:'Hide Filter'}
			]},
			{id:'view', title:'View'}
		      ],
		    }
		)

	return that;
}
