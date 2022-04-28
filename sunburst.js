const sunWidth = 600,
  sunHeight = 600,
  radius = Math.min(sunWidth, sunHeight) / 2;

const sunFormatDec = d3.format(".2f")

var sunScaleColor = d3.scaleSequential()
  .domain([2, 8.5])
  .interpolator(d3.interpolateInferno);;

var sunPartition = d3.partition(); // subdivides layers

var sunX = d3.scaleLinear() // continuous scale. preserves proportional differences
    .range([0, 2 * Math.PI]); // setting range from 0 to 2 * circumference of a circle

var sunY = d3.scaleSqrt() // continuous power scale 
    .range([0, radius]); // setting range from 0 to radius

var sunArc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, sunX(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, sunX(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, sunY(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, sunY(d.y1)); });


// create a tooltip
var tooltip = d3.select("body")
    .append("div").classed('tooltip', true)
    .style("position", "absolute")
    .style("text-align", "center")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "lightsteelblue")
    .style("font", "sans-serif")
    .style("border", "0px")
    .style("border-radius", "8px")
    .style("padding", "4px")

// Get the data from our JSON file
d3.json('countries.json', function(error, root) {
    if (error) throw error;
    render(root);
});

function render(data) {
    var sunRoot = d3.hierarchy(data).sum(function (d) { return d.size});
    
    sunRoot.data.children.forEach(function(d){
        d.enabled = true;
      })

// define SVG element
var sunSvg = d3.select("#div_template").append("svg")
    .attr("width", sunWidth) // set width
    .attr("height", sunHeight) // set height
  .append("g") // append g element
    .attr("transform", "translate(" + sunWidth / 2 + "," + (sunHeight / 2) + ")");

var sunPath = sunSvg.selectAll("path")
    .data(sunPartition(sunRoot).descendants()) // path for each descendant
    .enter().append("path")
        .attr("d", sunArc) // draw arcs
        .attr("class", "path")
        .style('stroke', '#fff')
        .style('fill', function (d) {
            if (d.data.id == "COUNTRIES") {
               return "#FFF"; 
            }
            return sunScaleColor(d.data.score); 
            })
    .on("click", click)
    .on('mouseover', function(d) {
    if (d.data.id != "COUNTRIES") {  
    tooltip
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
  })
  .on('mouseleave', function(d) { // when mouse leaves div     
    if (d.data.id != "COUNTRIES") {                     
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "white")
            .style("opacity", 1)
    }
  })
  .on('mousemove', function(d) { // when mouse moves 
        if (d.data.id != "COUNTRIES") {              
        tooltip
            .html(d.data.id + "<br>Happiness Score: " + sunFormatDec(d.data.score))
            .style("left", (d3.event.pageX + 10) + "px") //position the tooltip on mouse cursor
            .style("top", (d3.event.pageY - 15) + "px") //position the tooltip on mouse cursor
        }
  });

  function click(d) {
    
    sunSvg.transition()
        .duration(750) // duration of transition
        .tween("scale", function() {
          var sunXd = d3.interpolate(sunX.domain(), [d.x0, d.x1]),
              sunYd = d3.interpolate(sunY.domain(), [d.y0, 1]),
              sunYr = d3.interpolate(sunY.range(), [d.y0 ? (80) : 0, radius]);
          return function(t) { sunX.domain(xd(t)); sunX.domain(yd(t)).range(yr(t)); };
        })
      .selectAll("path")
        .attrTween("d", function(d) { return function() { return sunArc(d); }; });
  }  

d3.select(self.frameElement).style("height", sunHeight + "px");

}
  
// redraw on disabled category
function redraw(d) {
    
    sunSvg.transition()
        .duration(750)
        .tween("scale", function() {
          var sunXd = d3.interpolate(sunX.domain(), [d.x0, d.x1]),
              sunYd = d3.interpolate(sunY.domain(), [d.y0, 1]),
              sunYr = d3.interpolate(sunY.range(), [d.y0 ? (radius/2) : 0, radius]);
          return function(t) { sunX.domain(xd(t)); sunY.domain(yd(t)).range(yr(t)); };
        })
      .selectAll("path")
        .attrTween("d", function(d) { return function() { return sunArc(d); }; });
    
  }