var body = d3.select('body');
var svg = d3.select('svg');

var tooltip = body
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var path = d3.geoPath();

var color = d3.scaleThreshold().domain().range(d3.schemePuBuGn[9]);

var g = svg
  .append('g')
  .attr('class', 'key')
  .attr('id', 'legend')
  .attr('transform', 'translate(0,40)');

const countyData =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const educationData =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

Promise.all([d3.json(countyData), d3.json(educationData)])
  .then((data) => {
    console.log(data[0]); // This will log county data
    console.log(data[1]); // This will log education data
  })
  .catch((err) => console.log(err));
