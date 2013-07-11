'use strict';

$mainMenu = Ox.MainMenu({
                menus: [
                    {id: 'file', title: 'File', items : [
				{id:'home', title:'Home',keyboard :'alt control j'},
				//{id:'about', title :'About', keyboard :'control a'},
				//{id:'contact', title : 'Contact'}
			]},
		    {id: 'edit', title: 'Edit',items : [
			{id: 'hideSidebar', title:'Hide Sidebar'},
			{id : 'hideFilter', title:'Hide Filter'}
			]},
			{id:'view', title:'View'}
		      ],
		    }
		)
		
	

