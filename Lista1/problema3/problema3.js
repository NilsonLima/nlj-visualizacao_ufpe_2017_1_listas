//global variables
var margin = {top: 90, bottom: 80, right: 20, left: 100};

var width = 680 - margin.right - margin.left;
var height = 620 - margin.top - margin.bottom;
var xpadding = 20;

var climate = new Climate( ); //instantiates climate dataset object

//define x, y and labels scales
var xScale = d3.scaleTime( )
                .domain([new Date(2017, 0, 1), new Date(2017, 11, 1)])
                .range([0, width]);

var yScale = d3.scaleLinear( )
               .domain([minMax("min") - 2, minMax("max") + 2])
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

    //adding legends...
    //upper legend
    _svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width + 2 * margin.left) / 2)
        .attr("y", (margin.top / 2.5))
        .attr("class", "legend")
        .text("São Paulo, Annual Temperature");

    //left side legend
    _svg.append("text")
        .attr("transform", "rotate(-90," + (margin.left / 2.5) + "," + ((height + margin.top + margin.bottom) / 2) + ")")
        .attr("x", (margin.left / 2))
        .attr("y", ((height + margin.top + margin.bottom) / 2))
        .attr("text-anchor", "middle")
        .attr("class", "legend")
        .text("Temp deg C");

    //bottom legend lines
    _svg.append("g")
        .attr("transform", "translate(" + (((width + margin.left + margin.right)/2) - 100) + "," +
                                          ((height + margin.top + 15) + ")"))
        .selectAll("path")
        .data([0, 1, 2])
        .enter( )
        .append("path")
        .attr("d", function(d){ return "M 0 " + (d * 20) + " L 30 " + (d * 20) ; })
        .attr("fill", "transparent")
        .attr("stroke", function(d) { return climate.colors[d]; })
        .attr("stroke-width", "3")
        .attr("stroke-linecap", "round");

    //bottom legend text
    _svg.append("g")
        .attr("transform", "translate(" + (((width + margin.left + margin.right)/2) - 60) + "," +
                                          ((height + margin.top + 20) + ")"))
        .selectAll("text")
        .data(climate.labels)
        .enter( )
        .append("text")
        .attr("x", 0)
        .attr("y", function(d, i){ return (i * 20); })
        .attr("class", "legend")
        .style("font-size", "16px")
        .text(function(d){ return d; });


//creates a group object to display line chart
var _g1 = _svg.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //display average high
    _g1.append("path")
       .attr("d", writePath(climate.hmean))
       .attr("stroke", climate.colors[1])
       .attr("stroke-width", "3")
       .attr("stroke-linecap", "round")
       .attr("fill", "transparent");

    //display daily average
    _g1.append("path")
       .attr("d", writePath(climate.mean))
       .attr("stroke", climate.colors[0])
       .attr("stroke-width", "3")
       .attr("stroke-linecap", "round")
       .attr("fill", "transparent");

    //display average low
    _g1.append("path")
       .attr("d", writePath(climate.lmean))
       .attr("stroke", climate.colors[2])
       .attr("stroke-width", "3")
       .attr("stroke-linecap", "round")
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
