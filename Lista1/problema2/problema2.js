var svgwidth = 800;
var svgheight = 500;

d3.select("body")
  .append("button")
  .attr("type", "button")
  .attr("class", "play")
  .style("top", (svgheight + "px"))
  .style("left", ((svgwidth / 2) - 30)+ "px")
  .text("Random")
  .on("click", function(){
                  var npoints = getRandomInt(10, 51);
                  var dataset = createDataset(npoints);
                  createPlot(dataset, npoints, svgwidth, svgheight);
               })

function createPlot(dataset, npoints, svgwidth, svgheight){
      //delete previous scatter plot
      d3.select("body")
        .selectAll("svg")
        .remove();

      //plot shapes
      var margin = {vertical: 40, horizontal: 40};
      var width = svgwidth - 2 * margin.horizontal;
      var height = svgheight - 2 * margin.vertical;
      var rPadding = 6;

      //creates scales for x and y position, radius r and color from black to blue
      var xScale = d3.scaleLinear( )
                     .domain([0, d3.max(dataset, function(d){ return d[0]; })])
                     .rangeRound([rPadding, width - rPadding]);

      var yScale = d3.scaleLinear( )
                     .domain([0, d3.max(dataset, function(d){ return d[1]; })])
                     .rangeRound([height - rPadding, rPadding]);

      var rScale = d3.scaleLinear( )
                     .domain([0, d3.max(dataset, function(d){ return d[2]; })])
                     .rangeRound([3, 6]);

      var cScale = d3.scaleLinear( )
                     .domain([0, d3.max(dataset, function(d){ return d[3]; })])
                     .range(["black", "blue"]);

      //creates x and y axis
      var xAxis = d3.axisBottom( )
                    .scale(xScale);

      var yAxis = d3.axisLeft( )
                    .scale(yScale);

      //creates svg element inside html's body and instantiates an object
      var _svg = d3.select("body")
                   .append("svg")
                   .attr("width", svgwidth)
                   .attr("height", svgheight);

      //adding x and y axis on screen
      _svg.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(" + margin.horizontal + "," + (height + margin.vertical + 2) + ")")
          .call(xAxis);

      _svg.append("g")
          .attr("class", "yAxis")
          .attr("transform", "translate(" + (margin.horizontal - 2) + "," + margin.vertical + ")")
          .call(yAxis);

      //adding text on top side of the plot
      _svg.append("text")
          .attr("x", (svgwidth / 2) - 10)
          .attr("y", margin.horizontal / 2)
          .attr("font-family", "Verdana")
          .attr("font-size", 20)
          .text(npoints);

      //instantiates an svg group object where the dataset lies on screen
      // and insert data points
      _svg.append("g")
          .attr("transform", "translate(" + margin.horizontal + "," + margin.vertical + ")")
          .selectAll("circle")
          .data(dataset)
          .enter( )
          .append("circle")
          .attr("cx", function(d){ return xScale(d[0]); })
          .attr("cy", function(d){ return yScale(d[1]); })
          .attr("r", function(d){ return rScale(d[2]); })
          .attr("fill", function(d){ return cScale(d[3]); });
}

//generates a random dataset where each element is of dimension [x, y, z, w]
function createDataset(npoints){
  var array = new Array(npoints);

  for(var i = 0; i < npoints; i++){
      //generates four data points between 0 and 100
      var x = getRandomInt(0, 101);
      var y = getRandomInt(0, 101);
      var z = getRandomInt(0, 101);
      var w = getRandomInt(0, 101);

      array[i] = [x, y, z, w];
  }

  return array;
}

//generates a random number like [min, max)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
