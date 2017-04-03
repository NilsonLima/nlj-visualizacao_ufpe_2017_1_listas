class ScatterPlot {
    constructor(width, height, container){
        this.margin = {top: 15, left: 30, bottom: 30, right: 15};
        this.pltWidth = width - this.margin.left - this.margin.right;
        this.pltHeight = height - this.margin.top - this.margin.bottom;
        this.container = container;

        this.canvas = this.container.append("g")
                                    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.container.append("g")
                      .attr("class", "xAxis")
                      .attr("transform", "translate(" + this.margin.left + "," +
                                                       (this.pltHeight + this.margin.top) + ")");

        this.container.append("g")
                      .attr("class", "yAxis")
                      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.canvas.append("g")
                   .attr("class", "brush");
    }

    imshow(dataset){
        this.dataset = dataset;

        this.xScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[0]; }))
                        .range([0, this.pltWidth]);

        this.yScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[1]; }))
                        .range([this.pltHeight, 0]);

        this.cScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[2]; }))
                        .range(["orange", "steelblue"]);

        this.xAxis = d3.axisBottom( )
                       .scale(this.xScale);

        this.yAxis = d3.axisLeft( )
                       .scale(this.yScale);
    }

    show( ){
        var that = this;
        var circles = this.canvas.selectAll("circle")
                                 .data(this.dataset);

        circles.exit( )
               .remove( );

        circles.enter( )
               .merge(circles)
               .append("circle")
               .attr("cx", function(d){ return that.xScale(d[0]); })
               .attr("cy", function(d){ return that.yScale(d[1]); })
               .attr("fill", function(d){ return that.cScale(d[2]); })
               .attr("r", 3);

        this.brush = d3.brush( ).on("end", function( ){ that.__brush(that); });

        this.container.select(".xAxis").call(this.xAxis);
        this.container.select(".yAxis").call(this.yAxis);
        this.container.select(".brush").call(this.brush);
    }

    __brush(widget){
        var s = d3.event.selection;

        if(s){
          widget.xScale.domain([s[0][0], s[1][0]].map(widget.xScale.invert, widget.xScale))
          widget.yScale.domain([s[1][1], s[0][1]].map(widget.yScale.invert, widget.yScale))

          widget.container.select(".brush")
                          .call(widget.brush.move, null);

          widget.__zoom( );
        }
    }

    __zoom( ){
        var that = this;
        var t = d3.transition( ).duration(750);

        this.container.select(".xAxis")
                      .transition(t)
                      .call(this.xAxis);

        this.container.select(".yAxis")
                      .transition(t)
                      .call(this.yAxis);

        this.container.selectAll("circle")
                      .transition(t)
                      .attr("cx", function(d){ return that.xScale(d[0]); })
                      .attr("cy", function(d){ return that.yScale(d[1]); });
    }
}
