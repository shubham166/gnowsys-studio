<script type="text/javascript">

/* Javascript part of skeleteon.html to place graph in the view panel as graph tab is selected*/
function init(a,b)
{

 
  nodes_by_id = _.reduce(a, function(acc, n) {
        acc[n._id] = n;
        return acc;
      }, {});
     
     
	all_edges=new Array();  

	//this contains all the links between the nodes
  all_edges =_(b).chain().map(function(e) {
        e.source = nodes_by_id[e.from];
        e.target = nodes_by_id[e.to];
	//e.type = nodes_by_id[e.type]
        return e;
      }).filter(function(e){
        return nodes_by_id[e.from] && nodes_by_id[e.to]&& e.type!="title" && e.type!="content" 
      }).value();

 
}

function fgraph() {
neighbour_node= new Array();
clicked_node=new Array();
prev_node=new Array();
neighbour_node= neighbour_node.concat({{object.id}});		  

$.getJSON('/nodetypes/graphs/graph_json/' + {{object.id}}, function (json1) { 
										metadata=json1.node_metadata;
  										relations=json1.relations;
									
										init(metadata,relations);
										load({{object.id}}) });

	

function load(key)
{
  
/*			if (s > 0 ){
			var a = 50 * s;
			var w = 1000;
	   		var p = 140 + "%";
			var h = 650;
   			var q = 3 * s + 75 + "%";
			}else{*/
			var w = 1000;
	   		var p = 140 + "%";
			var h = 650;
   			var q = 110 + "%";			
			//}
        fill = d3.scale.category20();
 
  var vis = d3.select("#chart")
        .append("svg:svg")
	.attr("id", "amazingViz") 
        .attr("width", p)
        .attr("height", q);

    vis.append("svg:g").attr("class", "edges");        
    vis.append("svg:g").attr("class", "nodes");
  

  

	
	nodes_by_id[key].x = w/2.0;
	nodes_by_id[key].y = h/2.0;
      
 

	       
    var force = d3.layout.force()
              .linkStrength(1)
              .charge(-4000)
              .friction(0.7)
              .gravity(0.4)
              .linkDistance(50)
              .nodes([])
              .links([])
              .size([w, h])
              .start();

      function update(edges){
        _.each(nodes_by_id, function(n){n.added = false});
      nodes = _.reduce(edges, function(acc, e) {
          if(nodes_by_id[e.from] && !nodes_by_id[e.from].added){
            nodes_by_id[e.from].added = true;
            acc.push(nodes_by_id[e.from]);
          }
          if(nodes_by_id[e.to] && !nodes_by_id[e.to].added){
            nodes_by_id[e.to].added = true;
            acc.push(nodes_by_id[e.to]);
          }       
          return acc;
        }, []);
        
        force.nodes(nodes);
        force.links(edges);
        force.start();




        link = d3.select("#chart g.edges").selectAll("line.link").select(this.arrowhead)
                .data(edges, function(e){return e.from + "-" + e.to + "-" + e.type});
                
                link.enter().append("svg:line")
                .attr("class", "link")
                .style("stroke-width", 2 /* function(d) {
                  return Math.sqrt(d.value);
                } */ )
                .attr("x1", function(d) {
                  return d.source.x;
                })		
                .attr("y1", function(d) {
                  return d.source.y;
                })
                .attr("x2", function(d) {
                  return d.target.x;
                })
                .attr("y2", function(d) {
                  return d.target.y;
                })
                .attr("text", function(d) {
                  return d.type;
                })
		.attr("marker-end", "url(#arrowhead)");

		


	     
          
	  var node = d3.select("#chart g.nodes").selectAll("g.node").data(nodes);  

	    

 
          var new_g = node.enter().append("svg:a")
              .attr("class", function(d) { var e=(d._id).charAt(0); if (d._id==key) return "mainnode"; else if (e=="-") return "nodetext"; else if (isNaN(d._id)) return "relnode"  ; else return "node"; })   	      
	    
	      .call(force.drag);



		new_g.append("svg:marker")
                                .attr("id", "arrowhead")
                                .attr("viewBox","0 0 10 10")
                                .attr("refX","20")
                                .attr("refY","5")
                                .attr("markerUnits","strokeWidth")
                                .attr("markerWidth","9")
                                .attr("markerHeight","5")
                                .attr("orient","auto")
                                .append("svg:path")
                                .attr("d","M 0 0 L 10 5 L 0 10 z")


$(window).bind('keydown',function(event) {
		if(event.keyCode==17){
		 
		 new_g.on("click",function(d){                  
                               
                               
		                 
				
                if(d._id>0 && d.expanded=="true" && d._id!= {{object.id}})
				{ 
				
                                $.getJSON('/nodetypes/graphs/graph_json/' + d._id , function (json2) {
					new_metadata=json2.node_metadata;

 				});
                         	
                               _.filter(new_metadata, function(e){if(e._id>0) 
				{
				  clicked_node=clicked_node.concat(e._id) ;   
                                 }
                                });
				
				
 				index = _.indexOf(neighbour_node , d._id);
				prev_node=neighbour_node.slice(0,index);
				
				 neighbour_node = _.difference(neighbour_node,clicked_node) ;
				
                                neighbour_node= neighbour_node.concat(prev_node);
				neighbour_node = _.uniq(neighbour_node);
				metadata=[]
				relations=[]
			        metadata1=[]
				relations1=[]
					for(i=0;i<(neighbour_node.length);i++)
					{
                 
					d3.select("#amazingViz").remove();  
                                         g=neighbour_node[i]			
                                        
	    				
					
					$.ajax({
					async:false,
					url:'/nodetypes/graphs/graph_json/' + g , 
					datatype:'json',
					success:function (json2) {
	    			new_metadata=json2.node_metadata;
	  			new_relations=json2.relations;	
				metadata=_.union(new_metadata,metadata);
						
				relations=_.union(new_relations,relations);
				relations= check_Relationtype(metadata,relations); 
				}});						     			
							
			}
				_.each(metadata, function(m){
				
				  for(i=0;i<neighbour_node.length;i++)
				  	{
					if(m._id==neighbour_node[i])
						{m.expanded="true";}
					else 
						{m.expanded="false";}
					}
					   
                                
                                });
				
         			init(metadata,relations);
				load({{object.id}}) ;                        

 				
	
                            }

        


		else if(d._id>0 && d._id!= {{object.id}})
				{
                                
				neighbour_node =neighbour_node.concat(d._id);
				
				d3.select("#amazingViz").remove();  
				
				$.ajax({
					async:false,
					url:'/nodetypes/graphs/graph_json/' + d._id , 
					datatype:'json',
					success:function (json2) {
				
	    			new_metadata=json2.node_metadata;
	  			new_relations=json2.relations;	
				alert(relations);		
				metadata=_.union(new_metadata,metadata);
				relations=_.union(new_relations,relations);	
                                relations= check_Relationtype(metadata,relations);
				_.each(metadata, function(m){
				
				  for(i=0;i<neighbour_node.length;i++)
				  	{
					if(m._id==neighbour_node[i])
						m.expanded="true";
					}
				});
					   
                                
                                }});
				console.log(metadata);
				init(metadata,relations);
				load({{object.id}});


				
					
				}
});
}

});         




	new_g.on("click", function(d) {

		new_g.attr("xlink:href",function(d){return d.url;});
		});	

var i = 0,j=0,count=0;
		var str = relations[0]["type"];
		for(i=0;relations[i]!=null;i++)
		{
			relations[i]["col"] = "false";		
		}
		for(i=0;relations[i]!=null;i++)	
		{				
			console.log(relations[i]["type"]);	
			
			if(relations[i]["type"] == str)
			count++;
			else
			{
				if(count >=1)
				console.log(str + ":" + count);
				while(relations[j]!=null)
				{
					if((count >4) && (relations[j]["type"] == str))
					relations[j]["col"] = "true";
					j++;			
				}
				count = 0;
				str = relations[i]["type"];		
			}
			
		}	
  	  


			
		text1 = new_g.append("svg:text")
			.attr("class",function(d) {var e=(d._id).charAt(0); if (d._id==key){d.cls="mainnode"; return "mainnode";}else if (e=="-"){d.cls="nodetext"; return "nodetext";} else if (isNaN(d._id)){d.cls="relnode"; return "relnode";}  else{d.cls="node"; return "node";} })
                        .attr("y", 20)
	                .attr("x", 25) 
			.attr("dy", ".35em")
                        .attr("text-anchor","middle") 
			
                       
                        .text(function(d,i) {
                           d.w=d.screen_name.toString().length;
			//	if(relations[i]["col"]=="false" || d.cls=="mainnode" || d.cls=="relnode")
				return d.screen_name;
                        });  
			
                bbox = text1.node().getBBox();



	
		
		//var count=0;
	//	console.log(relations.toString());
		new_g.filter(function(d,i) {		//for each (x in d.relations){
							//	count=count+1;}
								
							 return ((d._id).charAt(0)=="-")
; }).append("svg:rect")
                                                      //.attr("x",function(d){ return (bbox.x+22+200/Math.pow(d.w,0.7))})
							.attr("x",function(d){ return 23-Math.pow(d.w,1.37)})
						       .attr("y", bbox.y)	
						       .attr("width", function(d) {var ttx=d.screen_name ; return (d.w*5+20)})
							.attr("height", bbox.height)
						      .call(force.drag)
				    		      .style("fill-opacity", ".1")
				                      .style("stroke", "#000")
				 		      .style("stroke-width","1px");
	
		var s;
		function E1(id,sname)
		{
			this.	name = name;
			this.id = 0;		
		}
		var col_txt = _(relations).chain().map(function(e){
				//var a = e.to;
				console.log("e.to " + nodes_by_id[e.to]["screen_name"] );
				var e1 = new E1();
				e1.id = e.to;
				e1.sname = nodes_by_id[e.to]["screen_name"];
				return e1;		
				}).value();


		var s=new Array();
		console.log("col_txt " + col_txt[1].id);
	
				new_g.filter(function(d,i) {
					var j = 0;
					while(col_txt[++j]!=null)
					{
						if(col_txt[j].id == relations[i]["to"])
						{	
							s[i] = col_txt[j].sname;
							//if(col_txt[j].sname=="software freedom")
								//console.log("check "+relations[i]["col"]+col_txt[j].sname);
							break;
						}
					}
					//console.log("s : " + s + ' relations[i]["to"] ' + relations[i]["to"]);
					return relations[i]["col"] == "true"})
					.append("svg:text")
					.attr("x",20)
					.attr("y", 45)
					//.text(function(d,i){ return s[i];})					
					.call(force.drag)
					.attr("dy", ".35em")
        		                .attr("text-anchor","middle") 
		var st='';
		for(i=1;i<5;i++){		
			st+=(s[i]+"\n");
		}
		console.log("final string :" +st);
						
		var p = d3.select("#chart").append("svg").attr("width",500).attr("height",200);
		var g = p.append("g")
		.call(force.drag)		
		.attr("transform","scale(0)");
	
		var text = g.append("text").attr("x",25).attr("y",50).text(st);
		g.transition().duration(500).attr("transform","scale(1)");	



var arr = new_g.filter(function(d) {		
		 return (d.type) });
	
			var arr1 = eval(arr);

console.log(new_g);



		
		
		for(i=0;relations[i]!=null;i++)
		{
			console.log("TYPE " + relations[i]["type"] + " COL " + relations[i]["col"]);
		}
			
			new_g.filter(function(d) { 
					return (d._id)>0;}).append("svg:ellipse")
				    .attr("cx", function(d){return (23 + Math.pow(d.w,0.33))})
				    .attr("cy", bbox.y+11)
				    .call(force.drag)
				    .attr("rx",function(d) {var ttx=d.screen_name ; return (d.w*5+15)})
				    .attr("ry",13)
				    .style("fill-opacity", "0.3")
				    .style("stroke", "white")
				    .style("stroke-width", "0.0px")
				    .style("fill", function(d) {if ((d.expanded=="true" && d.refType=="Objecttype") ||(d._id=={{object.id}}) ) return "blue"; else if(d.expanded=="true" && d.refType=="Gbobject") return "red"; else return "none"});





           	node.exit().remove();
	
	all_edges = all_edges.filter( function(d,i){ return relations[i]["col"] == "false"}); 


        force.on("tick", function() {

          var x_center = $("#chart").width() / 2;
          var y_center = $("#chart").height() / 2;

          link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) { return "translate(" + (d.x-16) + "," + (d.y-16) + ")"; });

        });
      }

         
	
	update(all_edges);

      vis.style("opacity", 1e-6)
              .transition()
              .duration(1000)
              .style("opacity", 1);
      
  



}

function check_Relationtype(metadata,relations)
{

	
		_.each(metadata,function(d){
						    if (d.refType=="Relationtype")
							{ 
							  a=d.inverse;
							  if (d.flag==1)
							  {
							  	relations= _.reject(relations,function(e)
										     {
											return e.type==a
										     });
							  }
						          else if (d.flag==0)
							  {
							  	relations= _.reject(relations,function(e)
										     {
											return e.type==d.screen_name
										     });
							  }
							}
							 
						 }); 
return relations;


}


}
$(fgraph());

</script>

				<!--</div>!-->
	
                        
                 
