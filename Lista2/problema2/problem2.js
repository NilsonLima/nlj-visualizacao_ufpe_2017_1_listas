class ScatterPlot {
    constructor(width, height, dataset, container){
        this.margin = {top: 15, left: 30, bottom: 30, right: 15};
        this.pltWidth = width - this.margin.left - this.margin.right;
        this.pltHeight = height - this.margin.top - this.margin.bottom;
        this.dataset = dataset;
        this.container = container;

        this.xScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[0]; }))
                        .range([0, this.pltWidth]);

        this.yScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[1]; }))
                        .range([this.pltHeight, 0]);

        this.cScale = d3.scaleLinear( )
                        .domain(d3.extent(this.dataset, function(d){ return d[2]; }))
                        .range(["gray", "blue"]);

        this.xAxis = d3.axisBottom( )
                       .scale(this.xScale);

        this.yAxis = d3.axisLeft( )
                       .scale(this.yScale);
    }

    show( ){
        //test
        var that = this;

        this.canvas = this.container.append("g")
                                    .attr("transform", "translate(" + that.margin.left + "," + this.margin.top + ")");

        this.canvas.selectAll("circle")
                   .data(that.dataset)
                   .enter( )
                   .append("circle")
                   .attr("cx", function(d){ return that.xScale(d[0]); })
                   .attr("cy", function(d){ return that.yScale(d[1]); })
                   .attr("fill", function(d){ return that.cScale(d[2]); })
                   .attr("r", 5);

       this.container.append("g")
                     .attr("class", "xAxis")
                     .attr("transform", "translate(" + that.margin.left + "," +
                                                      (that.pltHeight + that.margin.top) + ")")
                     .call(that.xAxis);

       this.container.append("g")
                     .attr("class", "yAxis")
                     .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")")
                     .call(that.yAxis);
    }
}
