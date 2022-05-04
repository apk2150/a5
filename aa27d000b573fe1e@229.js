import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./7a9e12f9fb3d8e06@459.js";

// function _1(md){return(
// md`# A5`
// )}

function _data(FileAttachment){return(
FileAttachment("DataPanelWHR2021C2.xlsx - Copy of Sheet1 (1).csv").csv()
)}

function _sorteddata(data,d3){return(
data.slice().sort((a, b) => d3.descending(a.year, b.year))
)}

function _isinteresting(){return(
function isinteresting(value) {
  return value.interesting=="TRUE"
}
)}

function _filtered(sorteddata,isinteresting){return(
sorteddata.filter(isinteresting)
)}

function _chart(LineChart,sorteddata,width){return(
LineChart(sorteddata, {
  x: d => d.year,
  y: d => d.Life_Ladder,
  z: d => d.Country_name,
  yLabel: "Happiness score",
  xLabel: "year",
 
  width,
  yFormat: ".2",
  height: 500,
  color: "#4D026C",
  strokeLinejoin: 3,
  yDomain: [2,8.1]
  
})
)}

function _filteredAttr(select,filters){return(
select({
  title: "Select countires",
  description: "Press command to select multiple",
  options: filters,
  multiple: true
})
)}

function _chart2(LineChart,filtered2,width){return(
LineChart(filtered2, {
  x: d => +d.year,
  y: d => d.Life_Ladder,
  z: d => d.Country_name,
  yLabel: "Happieness",
  xLabel: "year",
  width,
  height: 500,
  color: "#4D026C",
  strokeLinejoin: 3
})
)}

function _chart3(LineChart,filtered2,width){return(
LineChart(filtered2, {
  x: d => d.year,
  y: d => d.Life_Ladder,
  z: d => d.Country_name,
  yLabel: "happiness score",
  xLabel: "year",
  width,
  height: 500,
  color: "#4D026C",
  strokeLinejoin: 3,

})
)}

function _10(filteredAttr){return(
filteredAttr
)}

function _filters(){return(
["Afghanistan","Albania","Algeria","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Croatia","Cyprus","Czech Republic","Denmark","Djibouti","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala","Guinea","Haiti","Honduras","Hong Kong S.A.R. of China","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Cyprus","North Macedonia","Norway","Pakistan","Palestinian Territories","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","Somaliland region","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Swaziland","Sweden","Switzerland","Syria","Taiwan Province of China","Tajikistan","Tanzania","Thailand","Togo","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"]
)}

function _filtered2(sorteddata,filteredAttr){return(
sorteddata.filter(function(d,i){ return filteredAttr.indexOf(d.Country_name) >= 0 })
)}

function _14(FileAttachment){return(
FileAttachment("DataPanelWHR2021C2.xlsx - Copy of Sheet1 (1).csv").csv()
)}

function _LineChart(d3){return(
function LineChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat= ".2", // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  color = "currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap = "round", // stroke line cap of line
  strokeLinejoin = "round", // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity=0.8, // stroke opacity of line
  mixBlendMode = "multiply", // blend mode of lines
  voronoi // show a Voronoi overlay? (for debugging)
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  const O = d3.map(data, d => d);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y, d => typeof d === "string" ? +d : d)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

  // Compute titles.
  const T = title === undefined ? Z : title === null ? null : d3.map(data, title);

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .style("-webkit-tap-highlight-color", "transparent")
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());

  // An optional Voronoi display (for fun).
  if (voronoi) svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", d3.Delaunay
        .from(I, i => xScale(X[i]), i => yScale(Y[i]))
        .voronoi([0, 0, width, height])
        .render());

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", typeof color === "string" ? color : null)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
      .style("mix-blend-mode", mixBlendMode)
      .attr("stroke", typeof color === "function" ? ([z]) => color(z) : null)
      .attr("d", ([, I]) => line(I));

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);
    const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
    path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
    dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
    if (T) dot.select("text").text(T[i]);
    svg.property("value", O[i]).dispatch("input", {bubbles: true});
  }

  function pointerentered() {
    path.style("mix-blend-mode", null).style("stroke", "#ddd");
    dot.attr("display", null);
  }

  function pointerleft() {
    path.style("mix-blend-mode", "multiply").style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
  }

  return Object.assign(svg.node(), {value: null});
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["DataPanelWHR2021C2.xlsx - Copy of Sheet1 (1).csv", {url: new URL("./files/89ca9cf8f162532b3badff9ff0faa04b85182310224c2016a09c0125281e9a87d42c4d4479ec929f33289409e3ccf5c35679743011fcfb026c0add5878da1e45", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  // main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("sorteddata")).define("sorteddata", ["data","d3"], _sorteddata);
  main.variable(observer("isinteresting")).define("isinteresting", _isinteresting);
  main.variable(observer("filtered")).define("filtered", ["sorteddata","isinteresting"], _filtered);
  main.variable(observer("chart")).define("chart", ["LineChart","sorteddata","width"], _chart);
  main.variable(observer("viewof filteredAttr")).define("viewof filteredAttr", ["select","filters"], _filteredAttr);
  main.variable(observer("filteredAttr")).define("filteredAttr", ["Generators", "viewof filteredAttr"], (G, _) => G.input(_));
  main.variable(observer("chart2")).define("chart2", ["LineChart","filtered2","width"], _chart2);
  main.variable(observer("chart3")).define("chart3", ["LineChart","filtered2","width"], _chart3);
  main.variable(observer()).define(["filteredAttr"], _10);
  main.variable(observer("filters")).define("filters", _filters);
  main.variable(observer("filtered2")).define("filtered2", ["sorteddata","filteredAttr"], _filtered2);
  const child1 = runtime.module(define1);
  main.import("select", child1);
  main.variable(observer()).define(["FileAttachment"], _14);
  main.variable(observer("LineChart")).define("LineChart", ["d3"], _LineChart);
  const child2 = runtime.module(define2);
  main.import("howto", child2);
  main.import("altplot", child2);
  return main;
}
