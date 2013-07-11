'user strict';

var rightPanel;
var $innerPanel = function(){
	var that = Ox.SplitPanel({
            elements: [
                {element: $listPanel() , size: 0.23 * screen.width},
		{element: rightPanel =$rightPanel(),size : (screen.width/4 )* 3}
            ],
            orientation: 'horizontal'
        });
	return that;

	
}
