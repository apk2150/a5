const sunWidth = 700,
sunHeight = 700,
radius = Math.min(sunWidth, sunHeight) / 2;

const formatDec = d3.format(".2f")

var scaleColor = d3.scaleSequential()
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
var sunTooltip = d3.select("body")
    .append("div").classed('tooltip', true)
    .style("position", "absolute")
    .style("text-align", "center")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#A0F3FC")
    .style("font-family", "sans-serif")
    .style("border", "0px")
    .style("border-radius", "8px")
    .style("padding", "4px")

// Get the data from our JSON file
d3.json('countries.json', function(error, root) {
    if (error) throw error;
    render(root);
});

function render(data) {
    var root = d3.hierarchy(data)
    .sum(function (d) { return d.size});
    
    root.data.children.forEach(function(d){
        d.enabled = true;
      })

// define SVG element
var sunSvg = d3.select("#div_template").append("svg")
    .attr("width", sunWidth) // set width
    .attr("height", sunHeight) // set height
    .append("g") // append g element
    .attr("transform", "translate(" + sunWidth / 2 + "," + (sunHeight / 2) + ")");

var nodes = sunPartition(root).descendants()

var sunPath = sunSvg.selectAll("path")
    .data(nodes) // path for each descendant
    .enter().append("path")
        .attr("d", sunArc) // draw arcs
        .attr("class", "path")
        .style('stroke', '#fff')
        .style('fill', function (d) {
            if (d.data.id == "COUNTRIES") {
               return "#ffffe0"; 
            }
            return scaleColor(d.data.score); 
            })

    .on("click", click)
    .on('mouseover', function(d) {
    if (d.data.id != "COUNTRIES") {  
    sunTooltip
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    })
  .on('mouseleave', function(d) { // when mouse leaves div     
    if (d.data.id != "COUNTRIES") {                     
        sunTooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "white")
            .style("opacity", 1)
    }
  })
  .on('mousemove', function(d) { // when mouse moves 
        if (d.data.id !== "COUNTRIES") {              
        sunTooltip
            .html(d.data.id + "<br>Happiness Score: " + formatDec(d.data.score))
            .style("left", (d3.event.pageX + 10) + "px") //position the tooltip on mouse cursor
            .style("top", (d3.event.pageY - 15) + "px") //position the tooltip on mouse cursor
        }
  })


  var sunText = sunSvg.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("transform", function(d) {
        return "translate(" + sunArc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
    .attr("dy", ".5em") // rotation align
    .style("font-family", "sans-serif")
    .style('fill', 'white')
    .style("font-size","10px")
    .attr("text-anchor", "middle")

    .text(function(d) { return d.children && d.data.id != "COUNTRIES" ? d.data.id : ""  });


  function click(d) {

    sunSvg.transition()
        .duration(750) // duration of transition
        .tween("scale", function() {
          var xd = d3.interpolate(sunX.domain(), [d.x0, d.x1]),
              yd = d3.interpolate(sunY.domain(), [d.y0, 1]),
              yr = d3.interpolate(sunY.range(), [d.y0 ? (80) : 0, radius]);
          return function(t) { sunX.domain(xd(t)); sunY.domain(yd(t)).range(yr(t)); };
        })

        if (d.data.id == "COUNTRIES") {
          var text = sunSvg.selectAll("text")
          .data(nodes)
          .enter().append("text")
          .attr("transform", function(d) {
              return "translate(" + sunArc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
          .attr("dy", ".5em") // rotation align
          .style("font-family", "sans-serif")
          .style('fill', 'white')
          .style("font-size","10px")
          .attr("text-anchor", "middle")
    
          .text(function(d) { return d.children && d.data.id !== "COUNTRIES" ? d.data.id : ""  });
    
        } else {
          sunSvg.selectAll("text").remove()
        }
    

    sunSvg.selectAll("text").transition().duration(750)
        .attrTween("transform", function(d) { return function() { return "translate(" + sunArc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")" }; });
        
    sunSvg.selectAll("path").transition().duration(750)
        .attrTween("d", function(d) { return function() { return sunArc(d); }; });
  }

d3.select(self.frameElement).style("height", sunHeight + "px");

  function computeTextRotation(d) {
      var angle = (sunX((d.x0 + d.x1)/2) - Math.PI / 2) / Math.PI * 180;
      return (angle > 90 || angle < 270) ? 90 + angle : 90 + angle;

  }
}