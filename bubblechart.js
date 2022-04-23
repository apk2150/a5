var width = 700;
var height = 300;
var padding = 100;


var svg3 = d3.select('div#bubble').append('svg')
			.attr('width', width)
			.attr('height', height)


// formatting the data displayed in the tooltip
var formatValue = d3.format(".2f");

var year = '2019';

var selected_variable = "logGDPPerCapita";
// var selected_variable_scaled = 'world_happiness_score_scaled';


d3.csv('countriesdata.csv', function(data){
	// define some useful scales
	var radiusScale = d3.scaleLinear()
		.domain(d3.extent(data, function(d) { return 5 }))
		.range([7, 30]);

	var scaleColor = d3.scaleSequential()
  		.domain([2, 8.5])
  		.interpolator(d3.interpolateInferno);;

	var xScale = d3.scaleLinear()
        .domain([6.966, 11.648])
		.rangeRound([padding, width - padding])

    // Add Y axis
    // var yScale = d3.scaleLinear()
    //     .domain([5,8])
    //     .range([ height - padding, padding]);

	// a function to highlight points when clicked

    // var createBarChart = function (d) {

    //     var barchart = d3.select('#bubblebar').append('svg')
    //         .attr('width', width)
    //         .attr('height', height);

        
    //     var bar = barchart.selectAll('.circ')
    //     .data(filtered())
    //     .enter().append('circle').classed('circ', true)
    //     // .filter(function(d) { return d.year == '2019' })
    //     .attr('r', 7)
    //     .attr('cx', function(d){ return xScale(d[selected_variable]); })
    //     // .attr('cy', function(d){ return yScale(d.lifeLadder); })
    //     .attr("fill", function(d) { return scaleColor(d.lifeLadder); })
    //     .attr("opacity", 0.8)
    //     // .attr("stroke", "black")
    //     .attr("stroke-width", 0.5)
    //     .on('click', handleClick)
    //     .on('mouseover', highlight)
    //     .on("mousemove", tipMousemove)
    //     .on("mouseout", removeHighlight);

    // }

	var handleClick = function (d) {

		var bubble_click = d3.select(this);

		if (bubble_click.on("mouseout")==null) {
			bubble_click.on("mouseout", removeHighlight);
		}else{
			bubble_click.on("mouseout", null);
		}


			
		// d3.select("#country").text("Country:" + d.country);
		// d3.select("#happiness").text("Rank:" + parseInt(d.index + 1));
		// d3.select("#index").text(selected_variable + ":" + d[selected_variable]);

	};

    var tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .attr("class", "tooltip")
        .style("background-color", "#E9D6F4")
        .style("width", "160px")
        .style("height", "60px")
        .style("padding", "10px")
        .style("border-radius", "10px")
        .style("border", "5px solid #E4C9F4")
        .style("opacity", 0);

	var highlight = function(d){
		
        d3.select(this)
        .style("stroke-width", 2)
		.style("stroke", "black")
        .style("opacity", 1);

        var html  = d["countryName"] + "<br>" + "Happiness Score: " + formatValue(d["lifeLadder"]) 
            + "<br>" + "GDP: " + formatValue(d["logGDPPerCapita"]) + "<br>" + "Year: " + d["year"];
        tooltip.html(html)
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
        d3.select('.tooltip')
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

        tooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!

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


	// function buildGraph(data){
		var circles = svg3.selectAll('.circ')
			.data(data)
			.enter().append('circle').classed('circ', true)
			.filter(function(d) { return d.year == year })
			.attr('r', 7)
			.attr('cx', function(d){return xScale(d[selected_variable]); })
			// .attr('cy', function(d){ return yScale(d.lifeLadder); })
			.attr("fill", function(d) { return scaleColor(d["lifeLadder"]); })
			.attr("opacity", 0.8)
			// .attr("stroke", "black")
			.attr("stroke-width", 0.5)
			.on('click', handleClick)
			.on('mouseover', highlight)
			.on("mousemove", tipMousemove)
			.on("mouseout", removeHighlight);

	
	var simulation = d3.forceSimulation(filtered(year))
		.force('x', d3.forceX(function(d){
				return xScale(d[selected_variable])
			})
		)
		.force('y', d3.forceY(height/2).strength(0.03))
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

        xScale.domain([minV, maxV])
        // console.log(xScale.domain)

		simulation.force('x', d3.forceX(function(d){
			return xScale(d[selected_variable])
		}))

	})
	// }
	// buildGraph(data.filter(function(d) { return d.year == year }))

	// var timeSlider = d3.sliderHorizontal()
    // .min(2008)
    // .max(2020)
    // .step(1)
    // .width(700)
    // .tickFormat(d3.format("d"))
	// .default(2019)
    // .on('onchange', val => {
    //     year = +val;
	// 	console.log(year)

		// svg3.selectAll('.circ')
		// .data(data)
		// .attr("class", "circ")
        // .filter(function(d) { return d.year == year })
		// .attr('r', 7)
		// .attr('cx', function(d){return xScale(d[selected_variable]); })
		// // .attr('cy', function(d){ return yScale(d.lifeLadder); })
		// .attr("fill", function(d) { return scaleColor(d["lifeLadder"]); })
        // .attr("opacity", 0.8)
		// // .attr("stroke", "black")
		// .attr("stroke-width", 0.5)
		// .on('click', handleClick)
		// .on('mouseover', highlight)
        // .on("mousemove", tipMousemove)
		// .on("mouseout", removeHighlight);

		// var noZeroes = filtered(year).filter(function(d) { return +d[selected_variable] !== 0 && d[selected_variable]; });
        // var minV = d3.min(noZeroes, d => +d[selected_variable]);
        // var maxV = d3.max(noZeroes, d => +d[selected_variable]);
        // console.log(minV, maxV)

        // xScale.domain([minV, maxV])

		// var newData = data.filter(function(d) { return d.year == year })
        // // console.log(xScale.domain)
		// // d3.selectAll(".circ").remove()
		// // d3.selectAll(".circ")
		// 	// .attr()
		// buildGraph(newData)

		// simulation.force('x', d3.forceX(function(d){
		// 	return xScale(d[selected_variable])
		// }))
	// })

	// var gslider = d3.select("div#slider").append("svg")
	// .attr("class", "slider")
	// .attr("width", 1000)
	// .attr("height", 100)
	// .append("g")
	// .attr("transform", "translate(30,10)");

	// gslider.call(timeSlider);

})






