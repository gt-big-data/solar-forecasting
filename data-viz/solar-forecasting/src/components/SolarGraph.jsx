import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from "topojson-client";
import './dataviz-style.css';
class SolarGraph extends Component {
  componentDidMount() {
    this.drawSolarGraph();
    this.drawSolarHeatMap();
  }

  drawSolarGraph = () => {
    var rowConverter = function (d) {
      return {
        date: new Date(+d.Year, (+d.Month - 1), +d.Day, +d.Hour, +d.Minute),
        GHI: parseFloat(d.GHI),
        Prediction: +d.Predictions
      };
    }
    //ASYNCHRONOUS - Load CSV file (1st Day Jan 2019 Sample)
    Promise.all([
      d3.csv("/data/Merriweather_2019_wPreds.csv", rowConverter),
      d3.csv("/data/Butler_2019_wPreds.csv", rowConverter),
      d3.csv("/data/Dublin_2019_wPreds.csv", rowConverter),
      d3.csv("/data/Simon_2019_wPreds.csv", rowConverter),
    ]).then(function (data) {
      // data[0] will contain merriweather
      // data[1] will contain butler
      // data[2] will contain dublin
      // data[3] will contain simon

      var datasetMerriweather = data[0];
      var datasetButler = data[1];
      var datasetDublin = data[2];
      var datasetSimon = data[3];

      //Array for only holding GHI data
      var GHIArray = [];

      //For console reference if needed (made them global)
      var xScale;
      var yScale;
      var tempYScale;

      
      //Scales to be used for line graph
      var timeXScale;
      var lineYScale;
      
      //grouping element parent (to add elements into)
      var gParent;
      
      //xAxis and yAxis- public for manuipulating by zooming.
      var xAxis;
      var yAxis;
      
      //line from d3.line(), public for modifying with zooming
      var line;
      var analysisLine;

      //Specifications for svg element.
      var w = 1260;
      var h = 740;
      var padding = 100; //padding that goes around svg. Important!
      
      //margin properties
      var margin = { top: 60, right: 10, bottom: 40, left: 10 }

      //width and height of actual graph
      var width = w - margin.left - margin.right;
      var height = h - margin.top - margin.bottom;
      
      var svg;
      
      //create new svg element for the graph. Has larger true width and height (w, h)

      svg = d3.select("#solar-graph")
        .attr("width", width)
        .attr("height", height)
        .attr('viewBox', [0, 0, w, h])
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .classed('svg-content', true)
        .attr("class", "lineviz");

        // .attr('width', width)
        // .attr('height', height)
        // .attr('viewBox', [0, 0, width, height])
        // .classed('svg-content', true);

      // Create rectangle for the clipping path. only graph parts inside rectangle will be shown.
      svg.append("defs").append("clipPath")
        .attr("id", "clip") //set id, referred to in css file.
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      timeXScale = d3.scaleTime() // time scaling for the x axis.
        .range([0, width]);

      //Linear scaling for y axis
      lineYScale = d3.scaleLinear()
        .range([height, 0]);

      //Set the gParent variable (to group future elements inside of)
      gParent = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      gParent.append('text')
        .attr('class', 'graph-title')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${w / 2}, ${-margin.top / 2})`)
        .text('Solar Predictions');

      //Create x axis once, approximately estimate 20 ticks.
      xAxis = d3.axisBottom()
        .scale(timeXScale)
        .ticks(20);

      //Create y axis once, also appx 20 ticks.
      yAxis = d3.axisLeft()
        .scale(lineYScale)
        .ticks(20);

      //Add a group element, shift x axis to bottom.
      gParent.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

      //Add a group element, shift y axis to left side.
      gParent.append("g")
        .attr("class", "axis axis--y");
      // use this statement to move axis to right, if desired
      // .attr("transform", "translate(" + width + ",0)")

      var merriweatherButton;
      var butlerButton;
      var dublinButton;
      var simonButton;
      var groupButton;
      var tempLol;

      createButtons();
      farmButtonClick(datasetMerriweather, merriweatherButton);

      //used for zooming capabilities.
      var t;
      var xt;
      var zoomPerformed = false;

      function displayLineGraph(dataset) {
        //This statement is only necessary if we want to view a part of the data.
        // dataset = dataset.slice(dataset.length - 4000, dataset.length);

        //Not sure if I have to move this guy or change him for the update. We will see...          FIX! Maybe...
        var zoom = d3.zoom()
          .scaleExtent([1, 400]) //how much I can zoom in
          .translateExtent([[0, 0], [width, height]]) //for performing translations
          .extent([[0, 0], [width, height]])
          .on("zoom", zoomed); // refer to zoomed function

        //Time scaling for x axis
        const test = dataset.map(d => d.date);

        timeXScale // time scaling for the x axis.
          .domain([
            d3.min(Object.values(test)),
            d3.max(Object.values(test))
          ]);

        //Linear scaling for y axis
        lineYScale
          .domain([0, d3.max(dataset, function (d) { return d.GHI; })]);

        // //Add a group element, shift x axis to bottom.
        // gParent.append("g")
        // .attr("class", "axis axis--x")
        // .attr("transform", "translate(0," + height + ")")
        // .call(xAxis);

        // //Add a group element, shift y axis to left side.
        // gParent.append("g")
        // // use this statement to move axis to right, if desired
        // // .attr("transform", "translate(" + width + ",0)")
        // .call(yAxis);

        gParent.select(".axis--x").call(xAxis);
        gParent.select(".axis--y").call(yAxis);


        //set value for line variable, set appropriate scaling.
        line = d3.line()
          .x(function (d) { return timeXScale(d.date); })
          .y(function (d) { return lineYScale(d.GHI); });

        //set value for analysis line using Prediction data
        analysisLine = d3.line()
          .x(function (d) { return timeXScale(d.date); })
          .y(function (d) { return lineYScale(d.Prediction); });


        //May have to modify this to make seamless transition. For now, we can just remove previous .lines & add new ones
        gParent.selectAll(".line").remove();

        //Create line
        gParent.append("path")
          //Bind the data appropriately
          .datum(dataset)

          .attr("class", "line")  //for later CSS purposes to reformat line
          .attr("id", "GHIDataLine")
          .attr("d", line); // refer to previous line generator defined.


        //Create line - same thing, but for prediction!
        gParent.append("path")
          //Bind the data appropriately
          .datum(dataset)
          .attr("class", "line")  //for later CSS purposes to reformat line
          .attr("id", "GHIPredictionLine")
          .attr("d", analysisLine); // refer to previous line generator defined.

        //Needed for zooming capabilities
        svg.call(zoom);

        //Make call at any update to KEEP the zoom when changing from one solar farm to another
        //Only do if zoom has been attempted before (otherwise, what's the point, and t and xt 
        //would not be defined).
        if (zoomPerformed) {
          zoomAction();
        }
      }

      //Function to scale the graph appropriately, alongside the x axis.
      //Particularly responds to a d3 event.
      function zoomed(event) {
        zoomPerformed = true; //Do not make false again.
        t = event.transform;
        xt = t.rescaleX(timeXScale);
        zoomAction();
      }

      //The actions that should result from zooming.
      function zoomAction() {
        gParent.select("#GHIDataLine").attr("d", line.x(function (d) { return xt(d.date); }));
        gParent.select("#GHIPredictionLine").attr("d", analysisLine.x(function (d) { return xt(d.date); }));
        gParent.select(".axis--x").call(xAxis.scale(xt));
      }

      /*
      Things that need to be implemented:
      Making the residual graph
      Researching error analysis for ARIMA model
      Create Legend.
      */

      function createButtons() {
        //Create 4 button on page.
        //Center it relative to the graph. Graph will be in center of page.
        //Thus, just two buttons left, two buttons right

        // var svg = d3.select("body")
        // .append("button")
        // .attr("width", w)
        // .attr("height", h);
        merriweatherButton = document.createElement('input');
        merriweatherButton.type = "button";
        merriweatherButton.value = "Merriweather";
        merriweatherButton.className = "solarfarmbutton";
        merriweatherButton.addEventListener('click', function () {
          farmButtonClick(datasetMerriweather, merriweatherButton);
        });

        butlerButton = document.createElement('input');
        butlerButton.type = "button";
        butlerButton.value = "Butler";
        butlerButton.className = "solarfarmbutton";
        butlerButton.addEventListener('click', function () {
          farmButtonClick(datasetButler, butlerButton);
        });

        dublinButton = document.createElement('input');
        dublinButton.type = "button";
        dublinButton.value = "Dublin";
        dublinButton.className = "solarfarmbutton";
        dublinButton.addEventListener('click', function () {
          farmButtonClick(datasetDublin, dublinButton);
        });

        simonButton = document.createElement('input');
        simonButton.type = "button";
        simonButton.value = "Simon";
        simonButton.className = "solarfarmbutton";
        simonButton.addEventListener('click', function () {
          farmButtonClick(datasetSimon, simonButton);
        });

        //To group buttons appropriately
        groupButton = document.createElement('div');
        groupButton.id = "groupbutton";

        groupButton.appendChild(merriweatherButton);

        tempLol = document.createElement('div');
        tempLol.className = "divider";
        groupButton.appendChild(tempLol);


        groupButton.appendChild(butlerButton);

        tempLol = document.createElement('div');
        tempLol.className = "divider";
        groupButton.appendChild(tempLol);

        groupButton.appendChild(dublinButton);

        tempLol = document.createElement('div');
        tempLol.className = "divider";
        groupButton.appendChild(tempLol);

        groupButton.appendChild(simonButton);
        groupButton.style.textAlign = "center";

        const buttonDiv = document.getElementById('button-group');
        buttonDiv.appendChild(groupButton);
      }

      //TODO
      function createLegend() {

      }

      function farmButtonClick(data, buttonEle) {
        //dataset here acts as a temp holder for whatever data we are
        //dealing with.

        //reset colors appropriately
        // merriweatherButton.style.backgroundColor = "white";
        // dublinButton.style.backgroundColor = "white";
        // butlerButton.style.backgroundColor = "white";
        // simonButton.style.backgroundColor = "white";
        // merriweatherButton.classList.remove("clickedfarmbutton");
        // dublinButton.classList.remove("clickedfarmbutton");
        // butlerButton.classList.remove("clickedfarmbutton");
        // simonButton.classList.remove("clickedfarmbutton");
        merriweatherButton.class = "solarfarmbutton";
        dublinButton.class = "solarfarmbutton";
        simonButton.class = "solarfarmbutton";
        butlerButton.class = "solarfarmbutton";


        merriweatherButton.id = "";
        dublinButton.id = "";
        butlerButton.id = "";
        simonButton.id = "";

        //set color for element that is on.
        // buttonEle.setAttribute("background-color", "#F76444");
        // buttonEle.style.backgroundColor = "#F76444";
        buttonEle.class = "";
        buttonEle.id = "clickedfarmbutton";

        // buttonEle.id = "clickedfarmbutton";
        displayLineGraph(data);
      }
    }).catch(function (err) {
      // handle error here
    });
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
    var h = 640;

    //margin properties
    var margin = { top: 40, right: 40, bottom: 40, left: 40 }

    //width and height of actual graph
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;

    var div = d3.select("#visualization-page").append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0);
    
    var svg = d3.select("#heat-map")
      .attr("width", width)
      .attr("height", height)
      .attr('viewBox', [0, 0, w, h])
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

      var countyColorHash = d3.scaleLinear()
        .domain([0, 800])
        .range([1, 0]);

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
        .attr('fill', (county, i) => {
          return d3.interpolateOrRd(countyColorHash(county.properties.GHI));
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
  }

  render() {
    return (
      <div id="visualization-page">
        <h2 style={{textAlign: 'center'}}>Solar Graph and Map</h2>
        <svg id="solar-graph"></svg>
        <div id="button-group"></div>
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
}
export default SolarGraph;