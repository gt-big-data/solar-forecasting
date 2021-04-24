import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
    const w = 1260;
    const h = 740;

    const updateCoordinates = this.props.updateCoordinates;
    const countySublocationList = this.props.sublocationList;

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

    const div = d3.select('.solar-map-page').append('div')
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

    Promise.all([
      d3.json('/data/Counties_Georgia_Topo.json'),
    ]).then(data => {
      const topoData = data[0];

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
        .attr('fill', (county, i) => {
          const countyName = county.properties.NAME10;
          if (countySublocationList[countyName]) {
            return colorScale(arrCountyGHI[i])
          }
          return 'var(--countyGray)';
        })
        .attr('cursor', 'pointer')
        .attr('class', 'county')
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

      function renderCountyData(county) {
        try {
          const countySublocationData = countySublocationList[county];
          if (countySublocationData === undefined) {
            throw `No data for ${county} county.`;
          }
          document.getElementById('error-message').style.opacity = 0;
          
          fetch(`http://127.0.0.1:5000/data/avg_noon_ghi/${county}`)
            .then(response => response.json())
            .then(sublocationData => {
              // drawing points
              g.selectAll('.sublocation')
              .data(countySublocationData)
              .enter()
              .append('circle')
              .attr('cx', (d) => projection([d.longitude, d.latitude])[0])
              .attr('cy', (d) => projection([d.longitude, d.latitude])[1])
              .attr('r', '.6px')
              .attr('fill', (d) => {
                for (let i = 0; i < sublocationData.length; i++) {
                  if (sublocationData[i].latitude === d.latitude && sublocationData[i].longitude === d.longitude) {
                    return colorScale(sublocationData[i]['Average Noon GHI']);
                  }
                }
              })
              .attr('class', 'sublocation')
              .on('click', (event, point) => clickSublocation(point));
            })
            .catch(error => console.log(error));
        } catch(error) {
          document.getElementById('error-message').style.opacity = 1;
        }
      }
      
      /**
       * Handles the click of the sublocation of a county
       */
      function clickSublocation(point) {
        document.getElementById('coordinates').innerText = `Lat: ${point.latitude}, Long: ${point.longitude}`;
        updateCoordinates(point.latitude, point.longitude);
      }

      /**
       * Handles the click of a county
       * @param {*} event 
       * @param {*} d 
       */
      function clicked(event, d) {
        // remove current rects
        g.selectAll('.sublocation').remove();

        const countyName = d.properties.NAME10;
        renderCountyData(countyName);

        // update select value
        document.getElementById('county-list').value = countyName;

        // style update
        counties.transition().attr('fill', 'var(--countyGray)');
        d3.select(this).transition(1000).attr('fill', 'var(--countyYellow)');

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

      /**
       * Handles reset
       */
      function reset() {
        // hide warning
        document.getElementById('error-message').style.opacity = 0;

        // reset select menu
        document.getElementById('county-list').value = '';

        // remove county data
        g.selectAll('.sublocation').remove();

        // reset color
        counties.transition(1000).attr('fill', (county, i) => {
          const countyName = county.properties.NAME10;
          if (countySublocationList[countyName]) {
            return colorScale(arrCountyGHI[i])
          }
          return 'var(--countyGray)';
        });

        // un-zoom
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
          <div id="error-message"><strong>No data for that county.</strong></div>
          <div>
            <p id="coordinates"></p>
            <Link to="/solargraph">
              <button id="view-detailed">View Detailed Data</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default SolarMap;
