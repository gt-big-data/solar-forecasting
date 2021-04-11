import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import * as d3 from 'd3';
import * as topojson from "topojson-client";
import './dataviz-style.css';

class SolarMap extends Component {

componentDidMount() {
// this.drawSolarGraph();
	this.drawSolarHeatMap();
}

	drawSolarHeatMap = () => {
    const loadPositionData = (fileName) => {
      d3.csv(`/data/muscogee/${fileName}`).then(function (pointData) {
        console.log(pointData);

        const location = document.getElementById('location');
        const longitude = document.getElementById('longitude');
        const latitude = document.getElementById('latitude');
        const elevation = document.getElementById('elevation');

        location.innerText = `Location: ${pointData[0][`Location ID`]}`;
        longitude.innerText = `Longitude: ${pointData[0][`Longitude`]}`;
        latitude.innerText = `Latitude: ${pointData[0][`Latitude`]}`;
        elevation.innerText = `Elevation: ${pointData[0][`Elevation`]}`;
      });
    }

    var w = 1260;
    var h = 840;

    //this gets range of colors in a specific domain
    var colorScale = d3.scaleLinear()
    .domain([0, 400, 800])       //remember, this is across 0 to the max GHI value. we have a pivot here as well
    // .range(["#c6d8f5", "#edae4a", "#c40e0e"]) //very retro blue to orange to red color, eh
    .range(["#f7ba86", "#f25050", "#370757"]) //a beautiful orange to red to purple. slight adjustments can be made in opacity (orange, red), but much nicer 

    var hLegend = 250; //to give space for legend at bottom (at the bottom inside of the svg)

    //margin properties
    var margin = { top: 40, right: 40, bottom: 40, left: 40 }

    //width and height of actual graph
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;

    var div = d3.select("#visualization-page-map").append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0);
    
    var svg = d3.select("#heat-map")
      .attr("width", width)
      .attr("height", height)
      .attr('viewBox', [0, 0, w, h + hLegend])
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .classed('svg-content', true)
      .attr('class', 'heat-map');

    var g = svg.append('g')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append('text')
      .attr('class', 'graph-title')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${w / 2}, 0)`)
      .text('Solar Heat Map of Georgia');

    d3.json("/data/Counties_Georgia_Topo.json").then(function (topoData) {
      const geoData = topojson.feature(topoData, {
        type: "GeometryCollection",
        geometries: topoData.objects.Counties_Georgia.geometries
      });

      var projection = d3.geoTransverseMercator()
        .rotate([83 + 26 / 60, -33 - 14 / 60])
        .fitExtent([[20, 20], [w, h]], geoData);

      var path = d3.geoPath()
        .projection(projection);

      //var generate random Array - array len appx 159. max ghi val = 800
      var arrCountyGHI = Array.from({length: 160}, () => Math.floor(Math.random() * 800));

      geoData.features.forEach((county, i) => {
        county.properties.GHI = arrCountyGHI[i];
      });
      
      g.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .on("click", (event, county) => {
          //something
        })
        .attr('fill', (county, i) => {
          return colorScale(arrCountyGHI[i]);
        })
        .on("mouseover", (event, county) => {
          div.transition()		
            .duration(200)		
            .style("opacity", .9);		
          div.html(`<span>${county.properties.NAMELSAD10}<br>GHI: ${county.properties.GHI}</span>`)	
            .style("left", (event.pageX) + "px")		
            .style("top", (event.pageY - 28) + "px");	
          });
      g.on("mouseout", (event, county) => {
        div.transition()		
          .duration(200)		
          .style("opacity", 0);	
      });
      
      g.append("path")
        .datum(topojson.mesh(topoData, topoData.objects.Counties_Georgia, function(a, b) { return a !== b; }))
        .attr("class", "county-border")
        .attr("d", path);

      // drawing points
      // NOTE: coordinates are [longitude, latitude]
      const muscogee = [
        {location: 955482, data: [-85.06, 32.57]}, 
        {location: 955488, data: [-85.06, 32.53]},
        {location: 955529, data: [-85.06, 32.49]},
        {location: 955751, data: [-85.06, 32.45]},
        {location: 955774, data: [-85.06, 32.41]},

        {location: 956423, data: [-85.02, 32.41]},
        {location: 956437, data: [-85.02, 32.45]},
        {location: 956579, data: [-85.02, 32.53]},
        {location: 956580, data: [-85.02, 32.57]},
        {location: 956690, data: [-85.02, 32.49]},

        {location: 957573, data: [-84.98, 32.57]},
        {location: 957588, data: [-84.98, 32.53]},
        {location: 957633, data: [-84.98, 32.49]},
        {location: 957794, data: [-84.98, 32.45]},
        {location: 957906, data: [-84.98, 32.41]},

        {location: 958460, data: [-84.94, 32.41]},
        {location: 958471, data: [-84.94, 32.49]},
        {location: 958594, data: [-84.94, 32.53]},
        {location: 958737, data: [-84.94, 32.57]},
        {location: 958765, data: [-84.94, 32.45]},

        {location: 959384, data: [-84.90, 32.53]},
        {location: 959437, data: [-84.90, 32.49]},
        {location: 959443, data: [-84.90, 32.41]},
        {location: 959506, data: [-84.90, 32.45]},
        {location: 959544, data: [-84.90, 32.57]},

        {location: 959840, data: [-84.86, 32.45]},
        {location: 959848, data: [-84.86, 32.41]},
        {location: 960007, data: [-84.86, 32.57]},
        {location: 960024, data: [-84.86, 32.53]}, 
        {location: 960169, data: [-84.86, 32.49]},  
 

        {location: 960495, data: [-84.82, 32.45]},
        {location: 960725, data: [-84.82, 32.53]},
        {location: 960728, data: [-84.82, 32.57]},
        {location: 960735, data: [-84.82, 32.49]},
        {location: 961233, data: [-84.82, 32.41]},

        {location: 961301, data: [-84.78, 32.49]},
        {location: 961537, data: [-84.78, 32.45]},
        {location: 961638, data: [-84.78, 32.41]},
        {location: 961759, data: [-84.78, 32.53]},  
        {location: 961897, data: [-84.78, 32.57]},

        {location: 962593, data: [-84.74, 32.49]},
        {location: 962627, data: [-84.74, 32.41]},
        {location: 962666, data: [-84.74, 32.53]},
        {location: 962667, data: [-84.74, 32.57]},
        {location: 962698, data: [-84.74, 32.45]},

        {location: 962984, data: [-84.70, 32.45]},
        {location: 963012, data: [-84.70, 32.53]},
        {location: 963018, data: [-84.70, 32.41]},
        {location: 963025, data: [-84.70, 32.57]},
        {location: 963038, data: [-84.70, 32.49]},
      ];
      g.selectAll("circle")
        .data(muscogee)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return projection(d.data)[0]; })
        .attr("cy", function (d) { return projection(d.data)[1]; })
        .attr("r", "2px")
        .attr("fill", "green")
        .on("click", (event, point) => {
          const fileName = `${point.location}_${point.data[1]}_${point.data[0]}_2019.csv`;
          loadPositionData(fileName);
        });
    });



    //a better way of writing it out, but not needed for now. keep in code.
    //A color scale
    // var colorScale = d3.scaleLinear()
    // .domain([0, 800])
    // .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c",
    //         "#f9d057","#f29e2e","#e76818","#d7191c"]);

    // //Append multiple color stops by using D3's data/enter step
    // linearGradient.selectAll("stop")
    // .data( colorScale.range() )
    // .enter().append("stop")
    // .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
    // .attr("stop-color", function(d) { return d; });



    //and this guy we can use for actually placing values literally in the correct spot
    var countScale = d3.scaleLinear()
    .domain([0, 800])       //same thing, from 0 to max GHI value.
    .range([0, width])

    //Calculate the variables for the temp gradient
    var numStops = colorScale.domain().length; //should be dependent on the number of elements in the COLOR SCALE range = # ele in color scale domain (ideally)
    var countRange = countScale.domain(); 
    countRange[2] = countRange[1] - countRange[0];
    var countPoint = [];
    for(var i = 0; i < numStops; i++) {
      countPoint.push(i * countRange[2]/(numStops-1) + countRange[0]); //Take partial differences (basically the stops and where they should be)
    }


    //Create the gradient
    svg.append("defs") //objects are not directly rendered, called later to render
      .append("linearGradient") //this is an actual element. defined via arrow (x1,x2, y1,y2)
      .attr("id", "legend-bigmap") //ID = critical here. We need to be able to reference this somehow later.
      .attr("x1", "0%").attr("y1", "0%") //%s determine how far along the arrow do you want to start color, and it scales it backwards ig to negative vals and whatev
      .attr("x2", "100%").attr("y2", "0%")
      .selectAll("stop") 
      .data(d3.range(numStops))           
      .enter().append("stop")             //for all these guys, generate a stop element (defines offset + stop-color)
      .attr("offset", function(d,i) {     
        return countScale( countPoint[i] )/width;
      })   
      .attr("stop-color", function(d,i) { 
        return colorScale( countPoint[i] );       //the interpreter of colorScale is here!.
      });


    var legendWidth = 600; //the length in the x direction
    //Color Legend container
    var legendsvg = svg.append("g")             //into the svg, we add a g element, which will wrap around our legend.
      .attr("class", "legendWrapper")
      .attr("transform", "translate(" + (width/2 + 80) + "," + (h + hLegend/2) + ")"); //this part here is important, how much we move it down.

      //FIX ^^, offset the rectangle BETTER (more "robustly" instead of + 80)!!!

    //Draw the Rectangle
    legendsvg.append("rect")          //using a rectangle element. We can adjust later on to beutify it
      .attr("class", "legendRect")    //in case we need to CSS REFERENCE it for beautifying 
      .attr("x", -legendWidth/2)
      .attr("y", 0)
      .attr("width", legendWidth)  
      .attr("height", 20)          
      .style("fill", "url(#legend-bigmap)"); //This calls and displays it. Very essential.

    //Append title
    legendsvg.append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", -20)
    .style("text-anchor", "middle")
    .text("Global Horizontal Irradiance (GHI)");

    //Add desc about units
    legendsvg.append("text")
    .attr("class", "legendDesc")
    .attr("x", 0)
    .attr("y", 60)
    .style("text-anchor", "middle")
    .text("*Measured in Watts per square meter (W/m^2)");

    var xScale = d3.scaleLinear()
   .range([-legendWidth/2, legendWidth/2])
   .domain([ 0, 800] );

    //Define x-axis
    var xAxis = d3.axisBottom()
    .ticks(5)
    //.tickFormat(formatPercent)
    .scale(xScale);

    //Set up X axis
    legendsvg.append("g")
    .attr("class", "map-legend-axis")
    .attr("transform", "translate(0," + (20) + ")")
    .call(xAxis);
  }



  render() {
    return (
      <div id="visualization-page-map">
        <h2 style={{textAlign: 'center'}}>Solar Map</h2>
        <svg id="heat-map"></svg>
        <div>
          <p id="location"></p>
          <p id="longitude"></p>
          <p id="latitude"></p>
          <p id="elevation"></p>
        </div>
      </div>
    );
  }

	// render() {
	// 	return (
	// 		<div> 
	// 			<title 
	// 				style={
	// 					{
	// 						fontSize: 85,
	// 						fontWeight : 'bold',
	// 						textAlign: 'center',
	// 						width: "100%",
	// 					}
	// 				} 
	// 				className="badge badge-primary">
	// 				Solar Map
	// 			</title>
	// 			<Link to='/'>
	// 				<button 
	// 					type="button" 
	// 					class="btn btn-primary" 
	// 					style={
	// 						{
	// 							display: 'block',
	// 							fontWeight : 'bold',
	// 							fontSize: 25,	
	// 							marginLeft: 'auto',
	// 						  	marginRight: 'auto',
	// 						  	width: "10%",
	// 						  	marginTop: "40%",
	// 						}
	// 					}> 
	// 					Back
	// 			 	</button>
	// 		 	</Link>
	// 		</div>
	// 	);
	// }
}
export default SolarMap;