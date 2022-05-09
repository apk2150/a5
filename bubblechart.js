var bubblewidth = 700;
var bubbleheight = 300;
var bubblepadding = 100;

var countBars = 0;

var bubblesvg = d3.select('div#bubble').append('svg')
			.attr('width', bubblewidth)
			.attr('height', bubbleheight)


// formatting the data displayed in the tooltip
var formatValue = d3.format(".2f");

var year = '2019';

var selected_variable = "logGDPPerCapita";
// var selected_variable_scaled = 'world_happiness_score_scaled';



d3.csv('countriesdata.csv', function(data){
	// define some useful scales

	var bubbleColor = d3.scaleSequential()
  		.domain([2, 8.5])
  		.interpolator(d3.interpolateInferno);

	continuous("#bubblelegend", bubbleColor);

	var bubblexScale = d3.scaleLinear()
        .domain([6.966, 11.648])
		.rangeRound([bubblepadding, bubblewidth - bubblepadding])


	var handleClick = function (d) {

		var bubble_click = d3.select(this);

		if (bubble_click.on("mouseout")==null) {
			bubble_click.on("mouseout", removeHighlight);

			if(year == '2020'){
				var countryname = d["countryName"].split(' ').join('.')
				d3.selectAll(".bar"+ countryname).remove();
				countBars -= 1;
	
				console.log("Unclicked", countBars);
				if(countBars <= 0){
					d3.selectAll(".bubblebarlegendOrd").remove();
		
				}
			}
		}else{
			bubble_click.on("mouseout", null);
			if(year == '2020'){
				drawBar(d["countryName"]);
				countBars += 1;

				console.log("Clicked", countBars);
				if (countBars > 0){
					createBarLegend();
				}
			}
		}

	};

    var bubbleTooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .attr("class", "bubbleTooltip")
        .style("background-color", "#E9D6F4")
        .style("width", "160px")
        .style("height", "150px")
        .style("padding", "10px")
        .style("border-radius", "10px")
        .style("border", "5px solid #E4C9F4")
		.style("text-align", "left")
        .style("opacity", 0);

	var highlight = function(d){
		
        d3.select(this)
        .style("stroke-width", 2)
		.style("stroke", "black")
        .style("opacity", 1);

        var html  = "<div style='font-size:14px; margin-bottom:-15px;'><b>" + d["countryName"] + "</b> </div>" + "<br>" + 
			"<div style='font-size:12px;'> <b>Happiness Score:</b> " + formatValue(d["lifeLadder"]) 
            + "<br>" + "<b>GDP:</b> " + formatValue(d["logGDPPerCapita"]) + "<br>" + 
			"<b>Life Expectancy:</b> " + formatValue(d["healthyLifeExpectancyAtBirth"]) + "<br>" +
			"<b>Social Support:</b> " + formatValue(d["socialSupport"]) + "<br>" +
			"<b>Freedom:</b> " + formatValue(d["freedomToMakeLifeChoices"]) + "</div>";
		bubbleTooltip.html(html)
//            .style("left", (360) + "px")
//            .style("top", (120) + "px")
                .style("left", (d3.event.pageX + 20) + "px") //position the tooltip on mouse cursor
                .style("top", (d3.event.pageY - 15) + "px") //position the tooltip on mouse cursor
            //.style("background-color", colors(d.country))
            .transition()
            .duration(200) // ms
            .style("opacity", .9) // started as 0!
	    
	};

    var tipMousemove = function(d) { 
        d3.select('.bubbleTooltip')
        .style('left', (d3.event.pageX + 20) + 'px') //position the tooltip on mouse cursor
        .style('top', (d3.event.pageY + 10) + 'px') //position the tooltip on mouse cursor
	};

	var removeHighlight = function(d){
		var bubble = d3.select(this);

        bubble
            .style("stroke-width", 0)
            .style("opacity", 0.8);
		
		if (bubble.on("mouseout")!=null){
			bubble.transition().delay(30)
			.style("stroke-width", 0)
            .style("opacity", 0.8);
		}

        bubbleTooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!

	};

	// set domain for selected variable
	// xScale.domain(d3.extent(data, function(d) { return d[selected_variable_scaled]; }));

	var initialized = false;
	var circles;


    function filtered(y){
        return data.filter(function(d) { return d["year"] == y })
    }


	function buildGraph(data){
		
		circles = bubblesvg.selectAll('.circ')
			.data(data)
			.enter().append('circle').classed('circ', true)
			
			.attr('r', 7)
			.attr('cx', function(d){return bubblexScale(d[selected_variable]); })
			.attr('cy', function(d){ return bubbleheight/2 })
			.attr("fill", function(d) { return bubbleColor(d["lifeLadder"]); })
			.attr("opacity", 0.8)
			// .attr("stroke", "black")
			.attr("stroke-width", 0.5)
			.on('click', handleClick)
			.on('mouseover', highlight)
			.on("mousemove", tipMousemove)
			.on("mouseout", removeHighlight)
			.attr("visibility", "hidden");
		
		initialized = true;

	
	var simulation = d3.forceSimulation().nodes(filtered(year))
		.force('x', d3.forceX(function(d){
				return bubblexScale(d[selected_variable])
			})
		)
		.force('y', d3.forceY(bubbleheight/2).strength(0.03))
		.force('collide', d3.forceCollide(function(d) { return 10; }).strength(0.9))
		.alpha(0.01)
		.alphaTarget(0.3)
		.alphaDecay(0.1)
		.on('tick', tick)
		.restart();

	function tick(){
		d3.selectAll('.circ')
			.attr('cx', function(d){return d.x})
			.attr('cy', function(d){return d.y})
			.attr("visibility", "visible");
	}

	// simulation
	// 		.nodes(filtered(year))
	// 		.on('tick', function(){
	// 			if(initialized){
	// 				d3.selectAll('.circ')
	// 				.attr('cx', function(d){return d.x})
	// 				.attr('cy', function(d){return d.y})
	// 				}
	// 		})
	// 		.restart();
			
	


	d3.selectAll('.bubble_select').on('click', function(){

		selected_variable = this.value;
        console.log("value", selected_variable)
		// selected_variable_scaled = this.value + '_scaled';

        // console.log(function(d) {d[selected_variable]})
        var noZeroes = filtered(year).filter(function(d) { return +d[selected_variable] !== 0 && d[selected_variable]; });
        var minV = d3.min(noZeroes, d => +d[selected_variable]);
        var maxV = d3.max(noZeroes, d => +d[selected_variable]);
        console.log(minV, maxV)

        bubblexScale.domain([minV, maxV])
        // console.log(xScale.domain)

		simulation.force('x', d3.forceX(function(d){
			return bubblexScale(d[selected_variable])
		}))

		if(selected_variable == "logGDPPerCapita"){
			d3.select("#explanation").text("GDP is calculated by taking log of the country's GDP. It shows how the country's economy is doing in the year.")
			d3.select("#left").text("Low GDP")
			d3.select("#right").text("High GDP")
		}
		else if(selected_variable == "healthyLifeExpectancyAtBirth"){
			d3.select("#explanation").text("Life Expectancy is the average life expectency in years for the country. It shows how healthy the country is in comparison to other countries.")
			d3.select("#left").text("Low Life Expentancy")
			d3.select("#right").text("High Life Expentancy")
		}
		else if(selected_variable == "socialSupport"){
			d3.select("#explanation").text("Social support is a score that is the average of a rating given by surveyors about how supported individuals feel. This shows a positive effect on the happiness score.")
			d3.select("#left").text("Low Social Support")
			d3.select("#right").text("High Social Support")
		}
		else if(selected_variable == "freedomToMakeLifeChoices"){
			d3.select("#explanation").text("Freedom to make life choices is a rating provided by individuals based on how much freedom they get in their country. This shows a positive effect on the happiness score. ")
			d3.select("#left").text("Less Freedom")
			d3.select("#right").text("More Freedom")
		}
		else if(selected_variable == "perceptionsOfCorruption"){
			d3.select("#explanation").text("Perceptions of corruption is a rating provided by individuals based on how corrupt they believe their government is. This shows a negative effect on the happiness score.")
			d3.select("#left").text("Low Perception of Corruption")
			d3.select("#right").text("High Perception of Corruption")
		}

	})
	}
	buildGraph(data.filter(function(d) { return d.year == year }))

	var timeSlider = d3.sliderRight()
    .min(2008)
    .max(2020)
    .step(1)
    .width(100)
	.height(300)
    .tickFormat(d3.format("d"))
	.default(2019)
    .on('onchange', val => {
        year = +val;
		console.log(year)

		var noZeroes = filtered(year).filter(function(d) { return +d[selected_variable] !== 0 && d[selected_variable]; });
        var minV = d3.min(noZeroes, d => +d[selected_variable]);
        var maxV = d3.max(noZeroes, d => +d[selected_variable]);
        console.log(minV, maxV)

        bubblexScale.domain([minV, maxV])

		var newData = data.filter(function(d) { return d.year == year })
        // console.log(xScale.domain)
		d3.selectAll(".circ").remove()
		// d3.selectAll(".circ")
			// .attr()
		buildGraph(newData)

		// simulation.force('x', d3.forceX(function(d){
		// 	return xScale(d[selected_variable])
		// }))
	})

	var gslider = d3.select("div#slider").append("svg")
	.attr("class", "slider")
	.attr("width", 100)
	.attr("height", 400)
	.attr("margin-left", 100)
	.append("g")
	.attr("transform", "translate(30,10)");

	gslider.call(timeSlider);

})












function drawBar(country)
{
	var bubblebarmargin = {top: 10, right: 30, bottom: 0, left: 120},
		bubblebarwidth = 700 - bubblebarmargin.left - bubblebarmargin.right,
		bubblebarheight = 80 - bubblebarmargin.top - bubblebarmargin.bottom;


	// append the svg object to the body of the page
	var bubblebarsvg = d3.select("#bubblebar")
	.append("svg").classed("bar" + country, true)
		.attr("width", bubblebarwidth + bubblebarmargin.left + bubblebarmargin.right)
		.attr("height", bubblebarheight + bubblebarmargin.top + bubblebarmargin.bottom)
	.append("g")
		.attr("transform",
			"translate(" + bubblebarmargin.left + "," + bubblebarmargin.top + ")");

	// Parse the Data
	d3.csv("countrieshappiness.csv", function(data) {

	// List of subgroups = header of the csv files = soil condition here
	var subgroups = data.columns.slice(11,16)


	// List of groups = species here = value of the first column called group -> I show them on the X axis
	var groups = d3.map(data.filter(function(d) {return d["year"] == '2020' && d["Country"] == country}), function(d){return(d["Country"])}).keys()

	// Add X axis
	var bubblebary = d3.scaleBand()
		.domain(groups)
		.range([0, bubblebarheight])
		.padding([0.2])
		bubblebarsvg.append("g")
		 .style("font", "16px times")
	  	.call(
			  d3.axisLeft(bubblebary)
			  .tickSize(0)
			  .tickPadding(10))
		.call(g => g.select(".domain").remove());


	// Add Y axis
	var bubblebarx = d3.scaleLinear()
		.domain([0, 5])
		.range([ 0, bubblebarwidth ]);
	//   svg.append("g")
	// 	.attr("transform", "translate(0," + newwidth + ")")
	//     .call(d3.axisBottom(x).tickSizeOuter(0));

	// color palette = one color per subgroup
	var bubblebarcolor = d3.scaleOrdinal()
		.domain(subgroups)
		.range(['#FF6C56','#58B23C','#3CB297', '#56B4FF', '#BBAAFF'])

	// var stackedTooltip = d3.select("body").append("div")
    //     .style("position", "absolute")
    //     .attr("class", "stackedTooltip")
    //     .style("background-color", "#AAC5FF")
    //     .style("width", "160px")
    //     .style("height", "40px")
    //     .style("padding", "10px")
    //     .style("border-radius", "10px")
    //     .style("border", "5px solid #76A2FF")
    //     .style("opacity", 0);

	// var showTooltip = function(d){
		
	// 	d3.select(this)
	// 	.style("stroke-width", 2)
	// 	.style("stroke", "black")
	// 	.style("opacity", 1);

	// 	var html  = "" + d.key;
	// 	stackedTooltip.html(html)
	// 			.style("left", (d3.event.pageX + 10) + "px") //position the tooltip on mouse cursor
	// 			.style("top", (d3.event.pageY - 100) + "px") //position the tooltip on mouse cursor
	// 		//.style("background-color", colors(d.country))
	// 		.transition()
	// 		.duration(200) // ms
	// 		.style("opacity", .9) // started as 0!
			
	// };

	// var tooltipMove = function(d) { 
    //     d3.select('.stackedTooltip')
    //     .style('left', (d3.event.pageX + 10) + 'px') //position the tooltip on mouse cursor
    //     .style('top', (d3.event.pageY - 100) + 'px') //position the tooltip on mouse cursor
	// };

	// var removeTooltip = function(d){
	// 	var box = d3.select(this);

    //     box
    //         .style("stroke-width", 0);
		
	// 	if (box.on("mouseout")!=null){
	// 		box.transition().delay(30)
	// 		.style("stroke-width", 0);
	// 	}

    //     stackedTooltip.transition()
    //       .duration(300) // ms
    //       .style("opacity", 0); // don't care about position!


	// };

	//stack the data? --> stack per subgroup
	var stackedData = d3.stack()
		.keys(subgroups)
		(data.filter(function(d) {return d["year"] == '2020' && d["Country"] == country}))

		console.log(stackedData)

	// Show the bars
	bubblebarsvg.append("g")
		.selectAll("g")
		// Enter in the stack data = loop key per key = group per group
		.data(stackedData)
		.enter().append("g")
		.attr("fill", function(d) { return bubblebarcolor(d.key); })
		// .on('mouseover', showTooltip)
		// .on('mouseout', removeTooltip)
		// .on('mousemove', tooltipMove)
		.selectAll("rect")
		// enter a second time = loop subgroup per subgroup to add all rectangles
		.data(function(d) { return d; })
		//   .filter(function(d) { return d.data["Country"] == "Finland"})
		.enter().append("rect")
			.attr("y", function(d) { return bubblebary(d.data["Country"]); })
			.attr("x", function(d) { return bubblebarx(d[0]); })
			.attr("width", function(d) { return bubblebarx(d[1]) - bubblebarx(d[0]); })
			.attr("height", 50)
			
	})
}

// create continuous color legend
function continuous(selector_id, colorscale) {
	var legendheight = 50,
		legendwidth = 400,
		margin = {top: 10, right: 10, bottom: 20, left: 2};
  
	var canvas = d3.select(selector_id)
	  .style("height", legendheight + "px")
	  .style("width", legendwidth + "px")
	  .style("position", "relative")
	  .append("canvas")
	  .attr("height", 1)
	  .attr("width", legendwidth - margin.right - margin.left)
	  .style("height", (legendheight - margin.top - margin.bottom) + "px")
	  .style("width", (legendwidth - margin.left - margin.right) + "px")
	  .style("border", "1px solid #000")
	  .style("position", "absolute")
	  .style("top", (margin.top) + "px")
	  .style("left", (margin.left) + "px")
	  .node();
  
	var ctx = canvas.getContext("2d");
  
	var legendscale = d3.scaleLinear()
	  .range([1, legendwidth - margin.right - margin.left])
	  .domain(colorscale.domain());
  
	// image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
	var image = ctx.createImageData(legendwidth, 1);
	d3.range(legendwidth).forEach(function(i) {
	  var c = d3.rgb(colorscale(legendscale.invert(i)));
	  image.data[4*i] = c.r;
	  image.data[4*i + 1] = c.g;
	  image.data[4*i + 2] = c.b;
	  image.data[4*i + 3] = 255;
	});
	ctx.putImageData(image, 0, 0);
  
	// A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
	// See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
	/*
	d3.range(legendheight).forEach(function(i) {
	  ctx.fillStyle = colorscale(legendscale.invert(i));
	  ctx.fillRect(0,i,1,1);
	});
	*/
  
	var legendaxis = d3.axisBottom()
	  .scale(legendscale)
	  .tickSize(6)
	  .ticks(8);
  
	var svg = d3.select(selector_id)
	  .append("svg")
	  .attr("height", (legendheight) + "px")
	  .attr("width", (legendwidth) + "px")
	  .style("position", "absolute")
	  .style("left", "0px")
	  .style("top", "0px")
  
	svg
	  .append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(" + (margin.left) + "," + (legendheight - margin.top - margin.bottom + 11) + ")")
	  .call(legendaxis);
};


function createBarLegend(){
	var ordinal = d3.scaleOrdinal()
		.domain(["Social Support", "Healthy Life Expectancy", "Freedom", "Generosity", "Perceptions of Corruption"])
		.range(['#FF6C56','#58B23C','#3CB297', '#56B4FF', '#BBAAFF'])

		var bubblebarlegend = d3.select("#bubblebarlegend");

		bubblebarlegend
		.append('svg')
		.classed("bubblebarlegendOrd", true)
		.attr('width', bubblewidth)
		.attr('height', bubbleheight)
		.append("g")
		.attr("class", "bubblebarlegendOrdinal")
		.attr("transform", "translate(10,10)");

		var legendOrdinal = d3.legendColor()
		//d3 symbol creates a path-string, for example
		//"M0,-8.059274488676564L9.306048591020996,
		//8.059274488676564 -9.306048591020996,8.059274488676564Z"
		.shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
		.shapePadding(10)
		//use cellFilter to hide the "e" cell
		// .cellFilter(function(d){ return d.label !== "e" })
		.scale(ordinal);

		bubblebarlegend.select(".bubblebarlegendOrdinal")
		.call(legendOrdinal);
          
}

