import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import './SolarMapPage.css';

const countyList = [
  "Appling",
  "Atkinson",
  "Bacon",
  "Baker",
  "Baldwin",
  "Banks",
  "Barrow",
  "Bartow",
  "Ben Hill",
  "Berrien",
  "Bibb",
  "Bleckley",
  "Brantley",
  "Brooks",
  "Bryan",
  "Bulloch",
  "Burke",
  "Butts",
  "Calhoun",
  "Camden",
  "Candler",
  "Carroll",
  "Catoosa",
  "Charlton",
  "Chatham",
  "Chattahoochee",
  "Chattooga",
  "Cherokee",
  "Clarke",
  "Clay",
  "Clayton",
  "Clinch",
  "Cobb",
  "Coffee",
  "Colquitt",
  "Columbia",
  "Cook",
  "Coweta",
  "Crawford",
  "Crisp",
  "Dade",
  "Dawson",
  "DeKalb",
  "Decatur",
  "Dodge",
  "Dooly",
  "Dougherty",
  "Douglas",
  "Early",
  "Echols",
  "Effingham",
  "Elbert",
  "Emanuel",
  "Evans",
  "Fannin",
  "Fayette",
  "Floyd",
  "Forsyth",
  "Franklin",
  "Fulton",
  "Gilmer",
  "Glascock",
  "Glynn",
  "Gordon",
  "Grady",
  "Greene",
  "Gwinnett",
  "Habersham",
  "Hall",
  "Hancock",
  "Haralson",
  "Harris",
  "Hart",
  "Heard",
  "Henry",
  "Houston",
  "Irwin",
  "Jackson",
  "Jasper",
  "Jeff Davis",
  "Jefferson",
  "Jenkins",
  "Johnson",
  "Jones",
  "Lamar",
  "Lanier",
  "Laurens",
  "Lee",
  "Liberty",
  "Lincoln",
  "Long",
  "Lowndes",
  "Lumpkin",
  "Macon",
  "Madison",
  "Marion",
  "McDuffie",
  "McIntosh",
  "Meriwether",
  "Miller",
  "Mitchell",
  "Monroe",
  "Montgomery",
  "Morgan",
  "Murray",
  "Muscogee",
  "Newton",
  "Oconee",
  "Oglethorpe",
  "Paulding",
  "Peach",
  "Pickens",
  "Pierce",
  "Pike",
  "Polk",
  "Pulaski",
  "Putnam",
  "Quitman",
  "Rabun",
  "Randolph",
  "Richmond",
  "Rockdale",
  "Schley",
  "Screven",
  "Seminole",
  "Spalding",
  "Stephens",
  "Stewart",
  "Sumter",
  "Talbot",
  "Taliaferro",
  "Tattnall",
  "Taylor",
  "Telfair",
  "Terrell",
  "Thomas",
  "Tift",
  "Toombs",
  "Towns",
  "Treutlen",
  "Troup",
  "Turner",
  "Twiggs",
  "Union",
  "Upson",
  "Walker",
  "Walton",
  "Ware",
  "Warren",
  "Washington",
  "Wayne",
  "Webster",
  "Wheeler",
  "White",
  "Whitfield",
  "Wilcox",
  "Wilkes",
  "Wilkinson",
  "Worth"
];
class SolarMap extends Component {
  componentDidMount() {
    this.drawSolarMap();
  }

  drawSolarMap = () => {
    const loadPositionData = (fileName) => {
      d3.csv(`/data/muscogee/${fileName}`).then((pointData) => {
        const location = document.getElementById('location');
        const longitude = document.getElementById('longitude');
        const latitude = document.getElementById('latitude');
        const elevation = document.getElementById('elevation');

        location.innerText = `Location: ${pointData[0]['Location ID']}`;
        longitude.innerText = `Longitude: ${pointData[0].Longitude}`;
        latitude.innerText = `Latitude: ${pointData[0].Latitude}`;
        elevation.innerText = `Elevation: ${pointData[0].Elevation}`;
      });
    };

    const w = 1260;
    const h = 740;

    // this gets range of colors in a specific domain
    // remember, this is across 0 to the max GHI value. we have a pivot here as well
    const colorScale = d3.scaleLinear()
      .domain([0, 400, 800])
      .range(["#f7ba86", '#f25050', '#370757']); // a beautiful orange to red to purple. slight adjustments can be made in opacity (orange, red), but much nicer

    const hLegend = 300; // to give space for legend at bottom (at the bottom inside of the svg)

    // margin properties
    const margin = {
      top: 40, right: 40, bottom: 40, left: 40,
    };

    // width and height of actual graph
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;

    const div = d3.select('#visualization-page').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const svg = d3.select('#heat-map')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, w, h + hLegend])
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .classed('svg-content', true);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    d3.json('/data/Counties_Georgia_Topo.json').then((topoData) => {
      const geoData = topojson.feature(topoData, {
        type: 'GeometryCollection',
        geometries: topoData.objects.Counties_Georgia.geometries,
      });

      const projection = d3.geoTransverseMercator()
        .rotate([83 + 26 / 60, -33 - 14 / 60])
        .fitExtent([[20, 20], [w, h]], geoData);

      const path = d3.geoPath()
        .projection(projection);

      // var generate random Array - array len appx 159. max ghi val = 800
      const arrCountyGHI = Array.from({ length: 160 }, () => Math.floor(Math.random() * 800));

      geoData.features.forEach((county, i) => {
        const currentCounty = county;
        currentCounty.properties.GHI = arrCountyGHI[i];
      });

      const counties = g.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', (county, i) => colorScale(arrCountyGHI[i]))
        .attr('cursor', 'pointer')
        .attr('id', county => county.properties.NAME10)
        .on('mouseover', (event, county) => {
          div.transition()
            .duration(200)
            .style('opacity', 0.9);
          div.html(`<span>${county.properties.NAMELSAD10}<br>GHI: ${county.properties.GHI}</span>`)
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('click', clicked);
      
      g.on('mouseout', () => {
        div.transition()
          .duration(200)
          .style('opacity', 0);
      });

      g.append('path')
        .datum(topojson.mesh(topoData, topoData.objects.Counties_Georgia, (a, b) => a !== b))
        .attr('class', 'county-border')
        .attr('d', path);

      function zoomed(event) {
        const { transform } = event;
        g.attr('transform', transform);
        g.attr('stroke-width', 1 / transform.k);
      }

      const zoom = d3.zoom()
        .scaleExtent([1, 9])
        .on('zoom', zoomed);

      function renderCountyData() {
        // drawing points
        // NOTE: coordinates are [longitude, latitude]
        const muscogee = [
          { location: 955482, data: [-85.06, 32.57] },
          { location: 955488, data: [-85.06, 32.53] },
          { location: 955529, data: [-85.06, 32.49] },
          { location: 955751, data: [-85.06, 32.45] },
          { location: 955774, data: [-85.06, 32.41] },

          { location: 956423, data: [-85.02, 32.41] },
          { location: 956437, data: [-85.02, 32.45] },
          { location: 956579, data: [-85.02, 32.53] },
          { location: 956580, data: [-85.02, 32.57] },
          { location: 956690, data: [-85.02, 32.49] },

          { location: 957573, data: [-84.98, 32.57] },
          { location: 957588, data: [-84.98, 32.53] },
          { location: 957633, data: [-84.98, 32.49] },
          { location: 957794, data: [-84.98, 32.45] },
          { location: 957906, data: [-84.98, 32.41] },

          { location: 958460, data: [-84.94, 32.41] },
          { location: 958471, data: [-84.94, 32.49] },
          { location: 958594, data: [-84.94, 32.53] },
          { location: 958737, data: [-84.94, 32.57] },
          { location: 958765, data: [-84.94, 32.45] },

          { location: 959384, data: [-84.90, 32.53] },
          { location: 959437, data: [-84.90, 32.49] },
          { location: 959443, data: [-84.90, 32.41] },
          { location: 959506, data: [-84.90, 32.45] },
          { location: 959544, data: [-84.90, 32.57] },

          { location: 959840, data: [-84.86, 32.45] },
          { location: 959848, data: [-84.86, 32.41] },
          { location: 960007, data: [-84.86, 32.57] },
          { location: 960024, data: [-84.86, 32.53] },
          { location: 960169, data: [-84.86, 32.49] },

          { location: 960495, data: [-84.82, 32.45] },
          { location: 960725, data: [-84.82, 32.53] },
          { location: 960728, data: [-84.82, 32.57] },
          { location: 960735, data: [-84.82, 32.49] },
          { location: 961233, data: [-84.82, 32.41] },

          { location: 961301, data: [-84.78, 32.49] },
          { location: 961537, data: [-84.78, 32.45] },
          { location: 961638, data: [-84.78, 32.41] },
          { location: 961759, data: [-84.78, 32.53] },
          { location: 961897, data: [-84.78, 32.57] },

          { location: 962593, data: [-84.74, 32.49] },
          { location: 962627, data: [-84.74, 32.41] },
          { location: 962666, data: [-84.74, 32.53] },
          { location: 962667, data: [-84.74, 32.57] },
          { location: 962698, data: [-84.74, 32.45] },

          { location: 962984, data: [-84.70, 32.45] },
          { location: 963012, data: [-84.70, 32.53] },
          { location: 963018, data: [-84.70, 32.41] },
          { location: 963025, data: [-84.70, 32.57] },
          { location: 963038, data: [-84.70, 32.49] },
        ];

        g.selectAll('rect')
          .data(muscogee)
          .enter()
          .append('rect')
          .attr('x', (d) => projection(d.data)[0])
          .attr('y', (d) => projection(d.data)[1])
          .attr('width', '6px')
          .attr('height', '7px')
          .attr('fill', () => colorScale(Math.floor(Math.random() * 400)))
          .on('click', (event, point) => {
            const fileName = `${point.location}_${point.data[1]}_${point.data[0]}_2019.csv`;
            loadPositionData(fileName);
          });
      }

      function clicked(event, d) {
        renderCountyData();

        // update select value
        document.getElementById('county-list').value = d.properties.NAME10;

        // style update
        counties.transition().style('fill', '#EFEFEF');
        d3.select(this).transition(1000).style('fill', '#edd287');

        // zoom
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        svg.transition().duration(75).call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(9, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, svg.node()),
        );
      }

      function reset() {
        // remove county data
        g.selectAll('rect').remove();

        // un-zoom
        counties.transition(1000).style('fill', (county, i) => colorScale(arrCountyGHI[i]));
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2]),
        );
      }
      svg.call(zoom);
      document.getElementById('reset-map').addEventListener('click', reset);
    });

    // a better way of writing it out, but not needed for now. keep in code.
    // A color scale
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

    // and this guy we can use for actually placing values literally in the correct spot
    const countScale = d3.scaleLinear()
      .domain([0, 800]) // same thing, from 0 to max GHI value.
      .range([0, width]);

    // Calculate the variables for the temp gradient
    const numStops = colorScale.domain().length;
    const countRange = countScale.domain();
    countRange[2] = countRange[1] - countRange[0];
    const countPoint = [];
    for (let i = 0; i < numStops; i += 1) {
      // Take partial differences (basically the stops and where they should be)
      countPoint.push((i * countRange[2]) / (numStops - 1) + countRange[0]);
    }

    // Create the gradient
    svg.append('defs') // objects are not directly rendered, called later to render
      .append('linearGradient') // this is an actual element. defined via arrow (x1,x2, y1,y2)
      .attr('id', 'legend-bigmap') // ID = critical here. We need to be able to reference this somehow later.
      .attr('x1', '0%')
      .attr('y1', '0%') // %s determine how far along the arrow do you want to start color, and it scales it backwards ig to negative vals and whatev
      .attr('x2', '100%')
      .attr('y2', '0%')
      .selectAll('stop')
      .data(d3.range(numStops))
      .enter()
      .append('stop') // for all these guys, generate a stop element (defines offset + stop-color)
      .attr('offset', (d, i) => countScale(countPoint[i]) / width)
      .attr('stop-color', (d, i) => colorScale(countPoint[i])); // the interpreter of colorScale is here!.

    const legendWidth = 600; // the length in the x direction
    // Color Legend container
    const legendsvg = svg.append('g') // into the svg, we add a g element, which will wrap around our legend.
      .attr('class', 'legendWrapper')
      .attr('transform', `translate(${width / 2 + 80},${h + hLegend / 2})`); // this part here is important, how much we move it down.

    // FIX ^^, offset the rectangle BETTER (more "robustly" instead of + 80)!!!

    // Draw the Rectangle
    legendsvg.append('rect') // using a rectangle element. We can adjust later on to beutify it
      .attr('class', 'legendRect') // in case we need to CSS REFERENCE it for beautifying
      .attr('x', -legendWidth / 2)
      .attr('y', 0)
      .attr('width', legendWidth)
      .attr('height', 20)
      .style('fill', 'url(#legend-bigmap)'); // This calls and displays it. Very essential.

    // Append title
    legendsvg.append('text')
      .attr('class', 'legendTitle')
      .attr('x', 0)
      .attr('y', -20)
      .style('text-anchor', 'middle')
      .text('Global Horizontal Irradiance (GHI)');

    // Add desc about units
    legendsvg.append('text')
      .attr('class', 'legendDesc')
      .attr('x', 0)
      .attr('y', 60)
      .style('text-anchor', 'middle')
      .text('*Measured in Watts per square meter (W/m^2)');

    const xScale = d3.scaleLinear()
      .range([-legendWidth / 2, legendWidth / 2])
      .domain([0, 800]);

    // Define x-axis
    const xAxis = d3.axisBottom()
      .ticks(5)
      // .tickFormat(formatPercent)
      .scale(xScale);

    // Set up X axis
    legendsvg.append('g')
      .attr('class', 'map-legend-axis')
      .attr('transform', `translate(0,${20})`)
      .call(xAxis);
  }

  updateCounty = () => {
    const county = document.getElementById('county-list').value;
    if (county === '') return;
    const countyObject = d3.select(`#${county}`);
    countyObject.dispatch('click');
  }

  render() {
    return (
      <div className="solar-map-page">
        <div className="map-container">
          <svg id="heat-map" />
        </div>
        <div className="sidebar">
          <h5>Solar Map</h5>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente in magnam labore
            nobis ea eum laudantium dolore aut laboriosam aspernatur, officiis cupiditate, officia
            laborum quas quasi reprehenderit. Nihil, corrupti possimus!
          </p>
          <div>
            <label for="county-list">County: </label>
            <select name="county-list" id="county-list" onChange={this.updateCounty}>
              <option selected="selected" value="">--Select a county--</option>
              {countyList.map(county => (
                <option value={county}>{county}</option>
              ))}
            </select>
          </div>
          <button type="button" id="reset-map">Reset Map</button>
          <div>
            <p id="longitude"></p>
            <p id="latitude"></p>
            <p id="location" />
            <p id="elevation" />
          </div>
        </div>
      </div>
    );
  }
}

export default SolarMap;
