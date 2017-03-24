var margin = {vertical: 40, horizontal: 40};
var width = 800 - 2 * margin.horizontal;
var height = 500 - 2 * margin.vertical;
var rPadding = 8;
var dataset, npoints;

//creates scales for x and y position, radius r and color from black to blue
var xScale = d3.scaleLinear( )
               .domain([0, 100])
               .range([rPadding, width - rPadding]);

var yScale = d3.scaleLinear( )
               .domain([0, 100])
               .range([height - rPadding, rPadding]);

var rScale = d3.scaleLinear( )
               .domain([0, 100])
               .range([3, 8]);

var cScale = d3.scaleLinear( )
               .domain([0, 100])
               .range(["gray", "blue"]);

//creates x and y axis
var xAxis = d3.axisBottom( )
              .scale(xScale);

var yAxis = d3.axisLeft( )
              .scale(yScale);

//creates svg element inside html's body and instantiates an object
var _svg = d3.select("body")
             .append("svg")
             .attr("width", (width + 2 * margin.horizontal))
             .attr("height", (height + 2 * margin.vertical));

//button event
d3.select("body")
  .append("button")
  .attr("type", "button")
  .attr("class", "play")
  .style("top", ((height + 2 * margin.vertical) + "px"))
  .style("left", (((width + 2 * margin.horizontal) / 2) - 30)+ "px")
  .text("Random")
  .on("click", function(){
                  scatterPlot( );
               });

//adding x and y axis on screen
_svg.append("g")
   .attr("class", "xAxis")
   .attr("transform", "translate(" + margin.horizontal + "," + (height + margin.vertical + 2) + ")")
   .call(xAxis);

_svg.append("g")
   .attr("class", "yAxis")
   .attr("transform", "translate(" + (margin.horizontal - 2) + "," + margin.vertical + ")")
   .call(yAxis);

//instantiates an svg group object where the dataset lies on screen and insert data points
function scatterPlot( ){
    npoints = getRandomInt(10, 51);
    dataset = createDataset( );

    //remove previous datapoints on screen
    _svg.selectAll("circle")
        .remove( );

    _svg.select("#title")
        .remove( );

    //draw circles
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

   //adding text on top side of the plot
   _svg.append("text")
      .attr("id", "title")
      .attr("x", ((width + 2 * margin.horizontal) / 2) - 10)
      .attr("y", margin.vertical / 2)
      .attr("font-family", "Verdana")
      .attr("font-size", 20)
      .text(npoints);
}

//generates a random dataset where each element is of dimension [x, y, z, w]
function createDataset( ){
    var array = new Array( );

    while(array.length < npoints){
        //generates four data points between 0 and 100
        var x = getRandomInt(0, 101);
        var y = getRandomInt(0, 101);
        var z = getRandomInt(0, 101);
        var w = getRandomInt(0, 101);

        if(!checkRepeated(array, x, y)){
            array.push([x, y, z, w]);
        }
    }

    return array;
}

//check if repeated x and y value were generated
function checkRepeated(array, x, y){
    for(var i = 0; i < array.length; i++){
        if(array[i][0] == x && array[i][1] == y){
            return true;
        }
    }

    return false;
}

//generates a random number like [min, max)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
