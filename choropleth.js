var body = d3.select('body');
var svg = d3.select('svg');

var tooltip = body
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

//Legend
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
g.append('text')
  .attr('class', 'caption')
  .attr('x', x.range()[0])
  .attr('y', -6)
  .attr('fill', '#000')
  .attr('text-anchor', 'start')
  .attr('font-weight', 'bold');

g.call(
  d3
    .axisBottom(x)
    .tickSize(13)
    .tickFormat(function (x) {
      return Math.round(x) + '%';
    })
    .tickValues(color.domain())
)
  .select('.domain')
  .remove();

const countyData =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const educationData =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

Promise.all([d3.json(countyData), d3.json(educationData)])
  .then((data) => {
    const county = data[0];
    const education = data[1];

    svg
      .append('g')
      .attr('class', 'counties')
      .selectAll('path')
      .data(topojson.feature(county, county.objects.counties).features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', path)
      .attr('fill', (d) => {
        // Retrieve education data for the county
        const countyId = d.id;
        const countyEducation = education.find((e) => e.fips === countyId);
        return color(countyEducation.bachelorsOrHigher);
      })
      .on('mouseover', function (event, d) {
        // Show tooltip
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(function () {
            var result = education.filter(function (obj) {
              return obj.fips === d.id;
            });
            if (result[0]) {
              return (
                result[0]['area_name'] +
                ', ' +
                result[0]['state'] +
                ': ' +
                result[0].bachelorsOrHigher +
                '%'
              );
            }

            return 0;
          })
          .attr('data-education', function () {
            let datapoint = education.filter(function (obj) {
              return obj.fips === d.id;
            });
            if (datapoint[0]) {
              return datapoint[0].bachelorsOrHigher;
            }
          })
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        // Hide tooltip
        tooltip.transition().duration(500).style('opacity', 0);
      });
  })
  .catch((err) => console.log(err));
