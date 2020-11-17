module.exports = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<script src="https://d3js.org/d3.v3.min.js"></script>
<style type="text/css">


path:hover {
	fill-opacity: .7;
}


div.tooltip {   
 	position: absolute;           
	text-align: center;           
	width: 60px;                  
	height: 28px;                 
	padding: 2px;             
	font: 12px sans-serif;        
	background: white;   
	border: 0px;      
	border-radius: 8px;           
	pointer-events: none;         
}
        

body {
	font: 11px sans-serif;
}
        

.legend {
	position:absolute;
	left:800px;
	top:350px;
}

</style>
</head>
<body>
<script type="text/javascript">



		

var width = 960;
var height = 500;


var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    
				   .scale([1000]);          

var path = d3.geo.path()              
		  	 .projection(projection);  

		

var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

d3.csv("stateslived.csv", function(data) {
color.domain([0,1,2,3]); // setting the range of the input data

d3.json("us-states.json", function(json) {

for (var i = 0; i < data.length; i++) {

	var dataState = data[i].state;

	var dataValue = data[i].visited;

	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		json.features[j].properties.visited = dataValue; 

		break;
		}
	}
}
		
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	var value = d.properties.visited;

	if (value) {
	return color(value);
	} else {
	return "rgb(213,222,217)";
	}
});

		 

d3.csv("cities-lived.csv", function(data) {

svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return projection([d.lon, d.lat])[0];
	})
	.attr("cy", function(d) {
		return projection([d.lon, d.lat])[1];
	})
	.attr("r", function(d) {
		return Math.sqrt(d.years) * 4;
	})
		.style("fill", "rgb(217,91,67)")	
		.style("opacity", 0.85)	

	.on("mouseover", function(d) {      
    	div.transition()        
      	   .duration(200)      
           .style("opacity", .9);      
           div.text(d.place)
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px");    
	})   

    // fade out tooltip on mouse out               
    .on("mouseout", function(d) {       
        div.transition()        
           .duration(500)      
           .style("opacity", 0);   
    });
});  
        

var legend = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	});

});
</script>
</body>
</html>
`