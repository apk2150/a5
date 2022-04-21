var vWidth = 500;
var vHeight = 500;
var vRadius = Math.min(vWidth, vHeight) / 2;
var vColor = d3.scaleOrdinal(d3.schemeCategory20b.slice(11));

// Prepare our physical space
var g = d3.select("#div_template")
    .append("svg")
        .attr('width', vWidth)
        .attr('height', vHeight)
    .append('g')
        .attr('transform', 'translate(' + vWidth / 2 + ',' + vHeight / 2 + ')');

// Declare d3 layout
var vLayout = d3.partition().size([2 * Math.PI, vRadius]);
var vArc = d3.arc()
    .startAngle(function (d) { return d.x0; })
    .endAngle(function (d) { return d.x1; })
    .innerRadius(function (d) { return d.y0; })
    .outerRadius(function (d) { return d.y1; });
    

// Get the data from our JSON file
d3.json('countries.json', function(error, vData) {
    if (error) throw error;
    drawSunburst(vData);
});

// create a tooltip
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("text-align", "center")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "lightsteelblue")
    .style("font", "sans-serif")
    .style("border", "0px")
    .style("border-radius", "8px")
    .style("padding", "4px")
    
    var formatDec = d3.format(".2f")

    var mouseover = function(d) {
    tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
  var mousemove = function(d) {
      tooltip
        .html(d.data.id + "<br>Happiness Score: " + formatDec(d.data.score))
        .style("left", (d3.event.pageX + 10) + "px") //position the tooltip on mouse cursor
        .style("top", (d3.event.pageY - 15) + "px") //position the tooltip on mouse cursor
  }
  var mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "white")
            .style("opacity", 1)
  }



/**
 * Draw our sunburst
 * @param {object} data - Hierarchical data
 */
function drawSunburst(data) {
    // Layout + Data
    var vRoot = d3.hierarchy(data).sum(function (d) { return d.size});
    var vNodes = vRoot.descendants();
    vLayout(vRoot);
    g.selectAll('g')
        .data(vNodes)
        .enter().append('g')
    // Draw on screen
        .append('path')
            .attr('display', function (d) { return d.depth ? null : 'none'; })
            .attr('d', vArc)
            .style('stroke', '#fff')
            .style('fill', function (d) { return vColor((d.children ? d : d.parent).data.id); })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
}
        

    // Add text
    // vSlices.append('text')
    //     .filter(function(d) { return d.parent; })
    //     .attr('transform', function(d) {
    //         return 'translate(' + vArc.centroid(d) + ') rotate(' + computeTextRotation(d) + ')'; })
    //     .attr('dx', '-20')
    //     .attr('dy', '.5em')
    //     .text(function(d) { return d.data.id });
