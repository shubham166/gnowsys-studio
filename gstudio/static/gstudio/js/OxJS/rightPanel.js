'use strict';
//declring variables
var toolbar2;
var view;
var viewPanel 

//panel for adding the groupButtons and viewPanel
var $rightPanel = function(){
	var that = Ox.SplitPanel({
		elements: [
                {element: toolbar2=$toolbar(0.028*screen.height,2),size:0.028*screen.height},
		{ element:viewPanel = $viewPanel() , size : 0.9044*screen.height},
               
            ],
            orientation: 'vertical'	
		
		})
		.bindEvent({
		resize : function(data){		//function not implemented TODO
		}});
	return that;

}
