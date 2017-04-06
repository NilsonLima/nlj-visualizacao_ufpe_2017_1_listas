class ScatterPlot {
    constructor(x, y, width, height, container, id, std=true, haxis=true, vaxis=true, zoom="none"){
        this.container = container;
        this.std = std;
        this.haxis = haxis;
        this.vaxis = vaxis;
        this.zoom = zoom;
        this.id =  id;
        this.x = x;
        this.y = y;

        this.margin = {top: 15, left: 45, bottom: 30, right: 15};
        this.pltWidth = width - this.margin.left - this.margin.right;
        this.pltHeight = height - this.margin.top - this.margin.bottom;

        this.canvas = this.container.append("g")
                                    .attr("transform", "translate(" + (this.margin.left + this.x) + "," +
                                                                      (this.margin.top + this.y) + ")");

        if(this.haxis){
            this.container.append("g")
                          .attr("class", "xAxis")
                          .attr("transform", "translate(" + (this.margin.left + this.x)+ "," +
                                                            (this.pltHeight + this.margin.top + this.y) + ")");
        }

        if(this.vaxis){
            this.container.append("g")
                          .attr("class", "yAxis")
                          .attr("transform", "translate(" + (this.margin.left + this.x) + "," +
                                                            (this.margin.top + this.y) + ")");
        }

        if(!this.std){
            this.canvas.append("g").attr("class", "brush");

            if(this.zoom == "in"){
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

        this.xScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[0]; }))
                        .range([0, this.pltWidth]);

        this.yScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[1]; }))
                        .range([this.pltHeight, 0]);

        this.cScale = d3.scaleOrdinal( )
                        .range(d3.schemeCategory20);

        this.xAxis = d3.axisBottom( )
                       .scale(this.xScale)
                       .tickPadding(10);

        this.yAxis = d3.axisLeft( )
                       .scale(this.yScale)
                       .tickPadding(10);

        this.brush = d3.brush( )
                       .on("brush", function( ){ that.__brush( ); })
                       .on("end", function( ){ that.__brush_end( ); });
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

        this.container.select(".xAxis").call(this.xAxis);
        this.container.select(".yAxis").call(this.yAxis);
        this.container.select(".brush").call(this.brush);
    }

    setSelected(ids){
        var that = this;

        this.canvas.selectAll("circle")
                   .attr("fill", function(d, i){
                                    if(ids.indexOf(i) != -1){
                                        return "red";
                                    }
                                    else{
                                        return that.cScale(d[2]);
                                    }
                                 });
    }

    resetSelected(ids){
        var that = this;

        this.canvas.selectAll("circle")
                   .attr("fill", function(d, i){
                                    if(ids.indexOf(i) != -1){
                                        return that.cScale(d[2]);
                                    }
                                 });
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
                                             return "red";
                                         }
                                         else{
                                             return that.cScale(d[2]);
                                         }
                                     });

            this.dset.call("setSelection", {caller: this.id, ids: this.ids});
        }
    }

    __brush_end( ){
        var that = this;
        var s = d3.event.selection;
        this.ids = [];

        if(s){
          this.canvas.select(".brush")
                        .call(this.brush.move, null);

          this.canvas.selectAll("circle")
                     .attr("fill", function(d, i){
                                      that.ids.push(i);
                                      return that.cScale(d[2]);
                                   });

          if(this.zoom == "in")
              this.__zoom_in(s);

          this.dreset.call("resetSelection", {caller: this.id, ids: this.ids});
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
