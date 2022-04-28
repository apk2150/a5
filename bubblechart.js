
// var sequentialScale = d3.scaleSequential()
// .domain([0,10])
// .interpolator(d3.interpolateInferno);

// var legend = d3.select("#bubblelegend");

// legend.append("g")
// .attr("class", "legendSequential")
// .attr("transform", "translate(20,20)");

// var legendSequential = d3.legendColor()
//   .shapeWidth(30)
//   .cells(10)
//   .orient("horizontal")
//   .scale(sequentialScale) 

// legend.select(".legendSequential")
// .call(legendSequential);



var bubblewidth = 700;
var bubbleheight = 300;
var bubblepadding = 100;


var bubblesvg = d3.select('div#bubble').append('svg')
			.attr('width', bubblewidth)
			.attr('height', bubbleheight)


// formatting the data displayed in the tooltip
var formatValue = d3.format(".2f");

var year = '2019';

var selected_variable = "logGDPPerCapita";
// var selected_variable_scaled = 'world_happiness_score_scaled';


// var sequentialScale = d3.scaleSequential(d3.interpolateInferno)
// .domain([2,8.5]);

// svg3.append("g")
// .attr("class", "legendSequential")
// .attr("transform", "translate(20,20)");

// var legendSequential = d3.legendColor()
//   .shapeWidth(30)
//   .cells(10)
//   .orient("horizontal")
//   .scale(sequentialScale) 

// svg3.select(".legendSequential")
// .call(legendSequential);


d3.csv('countriesdata.csv', function(data){
	// define some useful scales

	var bubbleColor = d3.scaleSequential()
  		.domain([2, 8.5])
  		.interpolator(d3.interpolateInferno);

	var bubblexScale = d3.scaleLinear()
        .domain([6.966, 11.648])
		.rangeRound([bubblepadding, bubblewidth - bubblepadding])


	var handleClick = function (d) {

		var bubble_click = d3.select(this);

		if (bubble_click.on("mouseout")==null) {
			bubble_click.on("mouseout", removeHighlight);
		}else{
			bubble_click.on("mouseout", null);
			if(year == '2020'){
				drawBar(d["countryName"]);
			}
		}

	};

    var bubbleTooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .attr("class", "bubbleTooltip")
        .style("background-color", "#E9D6F4")
        .style("width", "160px")
        .style("height", "120px")
        .style("padding", "10px")
        .style("border-radius", "10px")
        .style("border", "5px solid #E4C9F4")
        .style("opacity", 0);

	var highlight = function(d){
		
        d3.select(this)
        .style("stroke-width", 2)
		.style("stroke", "black")
        .style("opacity", 1);

        var html  = "<div style='font-size:17px; margin-bottom:-10px;'><b>" + d["countryName"] + "</b> </div>" + "<br>" + 
			"<div style='font-size:15px;'> <b>Happiness Score:</b> " + formatValue(d["lifeLadder"]) 
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

		d3.selectAll(".bar"+ d["countryName"]).remove();

	};

	// set domain for selected variable
	// xScale.domain(d3.extent(data, function(d) { return d[selected_variable_scaled]; }));


	function tick(){
		d3.selectAll('.circ')
			.attr('cx', function(d){return d.x})
			.attr('cy', function(d){return d.y})
	}

    function filtered(y){
        return data.filter(function(d) { return d["year"] == y })
    }


	function buildGraph(data){
		var circles = bubblesvg.selectAll('.circ')
			.data(data)
			.enter().append('circle').classed('circ', true)
			
			.attr('r', 7)
			.attr('cx', function(d){return bubblexScale(d[selected_variable]); })
			// .attr('cy', function(d){ return yScale(d.lifeLadder); })
			.attr("fill", function(d) { return bubbleColor(d["lifeLadder"]); })
			.attr("opacity", 0.8)
			// .attr("stroke", "black")
			.attr("stroke-width", 0.5)
			.on('click', handleClick)
			.on('mouseover', highlight)
			.on("mousemove", tipMousemove)
			.on("mouseout", removeHighlight);

	
	var simulation = d3.forceSimulation(filtered(year))
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
			d3.select("#explanation").text("How does the country's economy contribute to happiness?")
			d3.select("#left").text("Low GDP")
			d3.select("#right").text("High GDP")
		}
		else if(selected_variable == "healthyLifeExpectancyAtBirth"){
			d3.select("#explanation").text("How does the life expentancy of citizens correlate with happiness?")
			d3.select("#left").text("Low Life Expentancy")
			d3.select("#right").text("High Life Expentancy")
		}
		else if(selected_variable == "socialSupport"){
			d3.select("#explanation").text("Does social support have an affect on happiness?")
			d3.select("#left").text("Low Social Support")
			d3.select("#right").text("High Social Support")
		}
		else if(selected_variable == "freedomToMakeLifeChoices"){
			d3.select("#explanation").text("Is there a correlation between how much freedom a person gets and happiness?")
			d3.select("#left").text("Less Freedom")
			d3.select("#right").text("More Freedom")
		}
		else if(selected_variable == "perceptionsOfCorruption"){
			d3.select("#explanation").text("Is there a correlation between the perception of how corrupt the government is and happiness?")
			d3.select("#left").text("Low Perception of Corruption")
			d3.select("#right").text("High Perception of Corruption")
		}

	})
	}
	buildGraph(data.filter(function(d) { return d.year == year }))

	var timeSlider = d3.sliderHorizontal()
    .min(2008)
    .max(2020)
    .step(1)
    .width(700)
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
	.attr("width", 1000)
	.attr("height", 100)
	.append("g")
	.attr("transform", "translate(30,10)");

	gslider.call(timeSlider);

})












function drawBar(country)
{
	var bubblebarmargin = {top: 10, right: 30, bottom: 20, left: 250},
		bubblebarwidth = 1000 - bubblebarmargin.left - bubblebarmargin.right,
		bubblebarheight = 400 - bubblebarmargin.top - bubblebarmargin.bottom;


	// append the svg object to the body of the page
	var svg = d3.select("#bubblebar")
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
	var groups = d3.map(data, function(d){return(d["Country"])}).keys()

	// Add X axis
	var bubblebary = d3.scaleBand()
		.domain(groups)
		.range([0, bubblebarheight])
		.padding([0.2])
	//   svg.append("g")
	//   	.call(d3.axisLeft(y));

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

	var stackedTooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .attr("class", "stackedTooltip")
        .style("background-color", "#AAC5FF")
        .style("width", "160px")
        .style("height", "40px")
        .style("padding", "10px")
        .style("border-radius", "10px")
        .style("border", "5px solid #76A2FF")
        .style("opacity", 0);

	var showTooltip = function(d){
		
		d3.select(this)
		.style("stroke-width", 2)
		.style("stroke", "black")
		.style("opacity", 1);

		var html  = "" + d.key;
		stackedTooltip.html(html)
				.style("left", (d3.event.pageX + 10) + "px") //position the tooltip on mouse cursor
				.style("top", (d3.event.pageY - 100) + "px") //position the tooltip on mouse cursor
			//.style("background-color", colors(d.country))
			.transition()
			.duration(200) // ms
			.style("opacity", .9) // started as 0!
			
	};

	var tooltipMove = function(d) { 
        d3.select('.stackedTooltip')
        .style('left', (d3.event.pageX + 10) + 'px') //position the tooltip on mouse cursor
        .style('top', (d3.event.pageY - 100) + 'px') //position the tooltip on mouse cursor
	};

	var removeTooltip = function(d){
		var box = d3.select(this);

        box
            .style("stroke-width", 0);
		
		if (box.on("mouseout")!=null){
			box.transition().delay(30)
			.style("stroke-width", 0);
		}

        stackedTooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!


	};

	//stack the data? --> stack per subgroup
	var stackedData = d3.stack()
		.keys(subgroups)
		(data.filter(function(d) {return d["year"] == '2020' && d["Country"] == country}))

		console.log(stackedData)

	// Show the bars
	svg.append("g")
		.selectAll("g")
		// Enter in the stack data = loop key per key = group per group
		.data(stackedData)
		.enter().append("g")
		.attr("fill", function(d) { return bubblebarcolor(d.key); })
		.on('mouseover', showTooltip)
		.on('mouseout', removeTooltip)
		.on('mousemove', tooltipMove)
		.selectAll("rect")
		// enter a second time = loop subgroup per subgroup to add all rectangles
		.data(function(d) { return d; })
		//   .filter(function(d) { return d.data["Country"] == "Finland"})
		.enter().append("rect")
			// .attr("y", function(d) { return y(d.data["Country"]); })
			.attr("x", function(d) { return bubblebarx(d[0]); })
			.attr("width", function(d) { return bubblebarx(d[1]) - bubblebarx(d[0]); })
			.attr("height", 50)
			
	})
}

