//global variables
var margin = {top: 60, bottom: 80, right: 20, left: 50};

var width = 600 - margin.right - margin.left;
var height = 540 - margin.top - margin.bottom;
var xpadding = 20;

var climate = new Climate( ); //instantiates climate dataset object

//define x, y and labels scales
var xScale = d3.scaleTime( )
                .domain([new Date(2017, 0, 1), new Date(2017, 11, 1)])
                .range([0, width]);

var yScale = d3.scaleLinear( )
               .domain([minMax("min"), minMax("max")])
               .range([height, 0]);

//define x and y axis
var xAxis = d3.axisTop( )
              .scale(xScale)
              .tickFormat(d3.timeFormat("%b"))
              .tickSizeOuter(0)
              .tickPadding(10);

var yAxis = d3.axisLeft( )
              .scale(yScale)
              .tickSizeInner(-(width + 2 * xpadding))
              .tickSizeOuter(0)
              .tickPadding(10);

//creates svg object
var _svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom);

    //display yAxis on screen
    _svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (margin.left - xpadding) + "," + margin.top + ")")
        .call(yAxis);

    _svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(" + margin.left + "," + (margin.top - 1) + ")")
        .call(xAxis);

//creates a group object to display line chart
var _g1 = _svg.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //display average high
    _g1.append("path")
       .attr("d", writePath(climate.hmean))
       .attr("stroke", "darkred")
       .attr("stroke-width", "3")
       .attr("fill", "transparent");

    //display daily average
    _g1.append("path")
       .attr("d", writePath(climate.mean))
       .attr("stroke", "black")
       .attr("stroke-width", "3")
       .attr("fill", "transparent");

    //display average low
    _g1.append("path")
       .attr("d", writePath(climate.lmean))
       .attr("stroke", "steelblue")
       .attr("stroke-width", "3")
       .attr("fill", "transparent");


//returns min or max value from climate dataset
function minMax(act)
{
    var x = eval("d3." + act)(climate.hmean);
    var y = eval("d3." + act)(climate.mean);
    var z = eval("d3." + act)(climate.lmean);

    return eval("d3." + act)([x, y, z]);
}

//given an array of positions returns a string to print line path on screen
function writePath(d){
    var path = "M " + xScale(new Date(2017, 0, 1)) + " " + yScale(d[0]);

    for(var i = 1; i <= 11; i++){
        path += " L " + xScale(new Date(2017, i, 1)) + " " + yScale(d[i]);
    }

    return path;
}
