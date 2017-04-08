class ScatterPlot {
    constructor(dimensions, brushing, dispatch){
        this.container = dimensions.container;
        this.x = dimensions.x;
        this.y = dimensions.y;

        this.std = brushing.std;
        this.zoom = brushing.zoom;

        this.id =  dispatch.id;
        this.dflag = dispatch.flag;

        this.margin = {top: 45, left: 45, bottom: 20, right: 15};
        this.pltWidth = dimensions.width - this.margin.left - this.margin.right;
        this.pltHeight = dimensions.height - this.margin.top - this.margin.bottom;

        this.container.append("g")
                      .attr("class", "xAxis")
                      .attr("transform", "translate(" + (this.margin.left + this.x)+ "," +
                                                        (this.pltHeight + this.margin.top + this.y) + ")");

        this.container.append("g")
                      .attr("class", "yAxis")
                      .attr("transform", "translate(" + (this.margin.left + this.x) + "," +
                                                        (this.margin.top + this.y) + ")");

        this.canvas = this.container.append("g")
                                    .attr("transform", "translate(" + (this.margin.left + this.x) + "," +
                                                                      (this.margin.top + this.y) + ")")

        if(!this.std){
            var that = this;

            this.canvas.append("g").attr("class", "brush");
            this.brush = d3.brush( )
                           .on("start", function( ){ that.__brush_start( ); })
                           .on("brush", function( ){ that.__brush( ); });

            if(this.zoom){
                this.brush.on("end", function( ){ that.__brush_end( ); });

                this.canvas.append("defs")
                           .append("clipPath")
                           .attr("id", "canvas")
                           .append("rect")
                           .attr("width", this.pltWidth)
                           .attr("height", this.pltHeight);
            }
        }
    }

    imshow(dataset){
        var that = this;
        this.dataset = dataset;
        this.gray = d3.rgb(128, 128, 128);

        this.xScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[0]; }))
                        .range([0, this.pltWidth]);

        this.yScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[1]; }))
                        .range([this.pltHeight, 0]);

        this.gScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[2]; }))
                        .range([0, 1]);

        this.cScale = d3.scaleOrdinal( )
                        .range(d3.schemeCategory10);

        this.xAxis = d3.axisBottom( )
                       .scale(this.xScale);

        this.yAxis = d3.axisLeft( )
                       .scale(this.yScale);

    }

    ax(mode, grid){
        var stroke_path = "transparent",
            stroke_line = "transparent";
        var tickx = 0,
            ticky = 0;

        if(grid){
            stroke_line = "lightgray";
            tickx = grid.tickx;
            ticky = grid.ticky;
        }

        if(mode.x){
            this.xAxis.tickSizeInner(-tickx).tickPadding(10).ticks(7);
            this.container.select(".xAxis").call(this.xAxis);
            this.container.select(".xAxis")
                          .selectAll("line")
                          .attr("stroke", stroke_line);
            this.container.select(".xAxis")
                          .selectAll("path")
                          .attr("stroke", stroke_path);
        }

        if(mode.y){
            this.yAxis.tickSizeInner(-ticky).tickPadding(10).ticks(7);
            this.container.select(".yAxis").call(this.yAxis);
            this.container.select(".yAxis")
                          .selectAll("line")
                          .attr("stroke", stroke_line);
            this.container.select(".yAxis")
                          .selectAll("path")
                          .attr("stroke", stroke_path);
        }
    }

    show( ){
        var that = this;
        var circles = this.canvas.selectAll("circle")
                                 .data(this.dataset);

        circles.exit( ).remove( );
        circles.enter( )
               .append("circle")
               .merge(circles)
               .attr("cx", function(d){ return that.xScale(d[0]); })
               .attr("cy", function(d){ return that.yScale(d[1]); })
               .attr("fill", function(d){ return that.cScale(d[2]); })
               .attr("r", 3);

        this.container.select(".brush").call(this.brush);
    }

    legend(text){
        this.container.append("text")
                      .attr("id", "legend")
                      .attr("x", this.x + ((this.pltWidth + this.margin.left + this.margin.right) / 2))
                      .attr("y", this.margin.top / 2)
                      .attr("text-anchor", "middle")
                      .attr("font-family", "sans-serif")
                      .text(text);
    }

    setSelected(ids){
        var that = this;

        this.canvas.selectAll("circle")
                   .attr("fill", function(d, i){
                                    if(ids.indexOf(i) != -1){
                                        return that.cScale(d[2]);
                                    }
                                    else{
                                        return that.gray.brighter(that.gScale(d[2]));
                                    }
                                 });
    }

    resetSelected( ){
        var that = this;

        this.canvas.selectAll("circle")
                   .attr("fill", function(d){
                                    return that.cScale(d[2]);
                                 });

        this.canvas.select(".brush").call(this.brush.move, null);
    }

    __brush_start( ){
        var that = this;

        this.canvas.selectAll("circle")
                   .attr("fill", function(d){ return that.cScale(d[2]); });

        if(this.dflag){
            this.dreset.call("resetSelection", {caller: this.id});
        }
    }

    __brush( ){
        var that = this;
        var s = d3.event.selection;
        this.ids = [];

        if(s){
            this.canvas.selectAll("circle")
                       .attr("fill", function(d, i){
                                         var x = that.xScale(d[0]);
                                         var y = that.yScale(d[1]);

                                         if(s[0][0] <= x && s[1][0] >= x && s[0][1] <= y && s[1][1] >= y){
                                             that.ids.push(i);
                                             return that.cScale(d[2]);
                                         }
                                         else{
                                             return that.gray.brighter(that.gScale(d[2]));
                                         }
                                     });

            if(this.dflag){
                this.dset.call("setSelection", {caller: this.id, ids: this.ids});
            }
        }
    }

    __brush_end( ){
        var that = this;
        var s = d3.event.selection;

        if(s){
          this.canvas.selectAll("circle")
                     .attr("fill", function(d, i){
                                      return that.cScale(d[2]);
                                   });

          this.canvas.select(".brush").call(this.brush.move, null);

          if(this.zoom){
              this.__zoom_in(s);
          }
        }
    }

    __zoom_in(s){
        var that = this;
        var t = d3.transition( ).duration(750);

        this.xScale.domain([s[0][0], s[1][0]].map(this.xScale.invert));
        this.yScale.domain([s[1][1], s[0][1]].map(this.yScale.invert));

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
                      .attr("cy", function(d){ return that.yScale(d[1]); });
    }
}
