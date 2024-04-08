var body = d3.select('body');
var svg = d3.select('svg');

var tooltip = body
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

var path = d3.geoPath();

var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemePuBuGn[9]);

var g = svg
  .append('g')
  .attr('class', 'key')
  .attr('id', 'legend')
  .attr('transform', 'translate(0,40)');

g.selectAll('rect')
  .data(
    color.range().map(function (d) {
      d = color.invertExtent(d);
      if (d[0] === null) {
        d[0] = x.domain()[0];
      }
      if (d[1] === null) {
        d[1] = x.domain()[1];
      }
      return d;
    })
  )
  .enter()
  .append('rect')
  .attr('height', 8)
  .attr('x', function (d) {
    return x(d[0]);
  })
  .attr('width', function (d) {
    return d[0] && d[1] ? x(d[1]) - x(d[0]) : x(null);
  })
  .attr('fill', function (d) {
    return color(d[0]);
  });

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
