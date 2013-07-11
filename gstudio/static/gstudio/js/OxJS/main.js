'use strict';


	window.onload =
	  function() {
    		var div = document.createElement('div');
	    div.id = 'main';
		$('#main').append($outerPanel);
    	if (document.body.firstChild)
      	document.body.insertBefore(div, document.body.firstChild);
    		else
	      document.body.appendChild(div);
  };




