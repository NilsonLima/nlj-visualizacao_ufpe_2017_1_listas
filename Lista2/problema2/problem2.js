class ScatterPlot {
    constructor(width, height, container){
        this.margin = {top: 15, left: 45, bottom: 30, right: 15};
        this.pltWidth = width - this.margin.left - this.margin.right;
        this.pltHeight = height - this.margin.top - this.margin.bottom;
        this.container = container;

        this.canvas = this.container.append("g")
                                    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.canvas.append("g")
                   .attr("class", "brush");

        this.container.append("g")
                      .attr("class", "xAxis")
                      .attr("transform", "translate(" + this.margin.left + "," +
                                                       (this.pltHeight + this.margin.top) + ")");
        this.container.append("g")
                      .attr("class", "yAxis")
                      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
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

        this.canvas.append("defs")
                   .append("clipPath")
                   .attr("id", "canvas")
                   .append("rect")
                   .attr("width", this.pltWidth)
                   .attr("height", this.pltHeight);
    }

    show( ){
        var that = this;
        var circles = this.canvas.selectAll("circle")
                                 .data(this.dataset);

        circles.exit( )
               .remove( );

        circles.enter( )
               .append("circle")
               .merge(circles)
               .attr("cx", function(d){ return that.xScale(d[0]); })
               .attr("cy", function(d){ return that.yScale(d[1]); })
               .attr("fill", function(d){ return that.cScale(d[2]); })
               .attr("r", 3);

        this.brush = d3.brush( )
                       .on("brush", function( ){ that.__brush( ); })
                       .on("end", function( ){ that.__brush_end( ); });

        this.container.select(".xAxis").call(this.xAxis);
        this.container.select(".yAxis").call(this.yAxis);
        this.container.select(".brush").call(this.brush);
    }

    __brush( ){
        var that = this;
        var s = d3.event.selection;

        if(s){
            this.canvas.selectAll("circle")
                       .attr("fill", function(d){
                                        var x = that.xScale(d[0]);
                                        var y = that.yScale(d[1]);

                                        if(s[0][0] <= x && s[1][0] >= x && s[0][1] <= y && s[1][1] >= y){
                                            return "red";
                                        }

                                        return that.cScale(d[2]);
                                     });
        }
    }

    __brush_end( ){
        var s = d3.event.selection;

        if(s){
          this.xScale.domain([s[0][0], s[1][0]].map(this.xScale.invert));
          this.yScale.domain([s[1][1], s[0][1]].map(this.yScale.invert));

          this.canvas.select(".brush")
                        .call(this.brush.move, null);

          this.__zoom_in( );
        }
    }

    __zoom_in( ){
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
                      .attr("clip-path", "url(#canvas)")
                      .attr("cx", function(d){ return that.xScale(d[0]); })
                      .attr("cy", function(d){ return that.yScale(d[1]); })
                      .attr("fill", function(d){ return that.cScale(d[2]); });
    }
}
