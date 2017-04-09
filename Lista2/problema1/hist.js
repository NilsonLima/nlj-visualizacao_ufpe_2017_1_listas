class Histogram{
  constructor(dimensions, dispatch, dataset){
      this.container = dimensions.container.append("g");
      this.x = dimensions.x;
      this.y = dimensions.y;

      this.id =  dispatch.id;
      this.dflag = dispatch.flag;

      this.margin = {top: 20, left: 35, bottom: 20, right: 15};
      this.hstWidth = dimensions.width - this.margin.left - this.margin.right;
      this.hstHeight = dimensions.height - this.margin.top - this.margin.bottom;
      this.dataset = dataset;

      this.__allids__( );
      this.__init__( );

      this.container.append("g")
                    .attr("class", "yAxis")
                    .attr("transform", "translate(" + (this.margin.left + this.x) + "," +
                                                      (this.margin.top + this.y) + ")");

      this.container.append("g")
                    .attr("class", "xAxis")
                    .attr("transform", "translate(" + (this.margin.left + this.x)+ "," +
                                                      (this.hstHeight + this.margin.top + this.y) + ")");

      this.canvas = this.container.append("g")
                                  .attr("transform", "translate(" + (this.margin.left + this.x) + "," +
                                                                    (this.margin.top + this.y) + ")");

      this.xScale = d3.scaleBand( )
                      .domain(Array.from(new Set(this.hist.map(function(d){ return d[1]; }))))
                      .rangeRound([0, this.hstWidth])
                      .padding(0.5);

      this.yScale = d3.scaleLinear( )
                      .domain([0, d3.max(this.hist, function(d){ return d[0]; })])
                      .range([this.hstHeight, 0]);

      this.xAxis = d3.axisBottom( )
                     .scale(this.xScale);

      this.yAxis = d3.axisLeft( )
                     .scale(this.yScale);
   }

   show( ){
      var that = this;
      var bars = this.canvas.selectAll("rect")
                            .data(this.hist);

      var t = d3.transition( )
                .duration(750)
                .ease(d3.easeLinear);

      bars.exit( ).remove( )
          .transition(t);

      bars.enter( ).append("rect")
          .merge(bars)
          .attr("x", function(d){ return that.xScale(d[1]); })
          .attr("y", function(d){ return that.yScale(0); })
          .attr("height", 0)
          .attr("width", this.xScale.bandwidth( ))
          .transition(t)
              .attr("y", function(d){ return that.yScale(d[0]); })
              .attr("height", function(d){ return that.hstHeight - that.yScale(d[0]); })
              .attr("fill", d3.rgb(70, 130, 180));

      this.canvas.selectAll("rect")
                 .on("click", function(d, i){
                                    if(d3.event.button == 0){
                                        var _ids = [];
                                        var toggle = true;

                                        if(i == 0){
                                            _ids = that.__bar__("Gol");
                                        }
                                        else if(i == 1){
                                            _ids = that.__bar__("Tam");
                                        }
                                        else{
                                            _ids = that.__bar__("Azul");
                                        }

                                        if(d3.select(this).attr("fill") == "rgb(70, 130, 180)"){
                                            d3.select(this).attr("fill", "gray");
                                            toggle = false;
                                        }
                                        else{
                                            d3.select(this).attr("fill", d3.rgb(70, 130, 180));
                                        }

                                        if(that.dflag){
                                            that.dset.call("setSelection", {caller: this.id, ids: _ids, on: toggle});
                                        }
                                    }
                                 });

      this.container.select(".xAxis")
                    .call(this.xAxis);

      this.container.select(".yAxis")
                    .call(this.yAxis);
   }

   __bar__(carrier){
     var array = [];

     for(var i = 0; i < this.ids.length; i++){
         if(this.dataset[this.ids[i]][2] == carrier){
             array.push(this.ids[i]);
         }
     }

     return array;
   }

   __init__( ){
       var carriers = Array.from(new Set(this.dataset.map(function(d){ return d[2]; })));
       var occ = new Array(carriers.length).fill(0);
       this.hist = []

       for(var i = 0; i < this.dataset.length; i++){
           if(this.ids.indexOf(i) != -1){
               if(this.dataset[i][2] == carriers[0]){
                   ++occ[0];
               }
               else if(this.dataset[i][2] == carriers[1]){
                   ++occ[1];
               }
               else if(this.dataset[i][2] == carriers[2]){
                   ++occ[2];
               }
          }
       }

       for(var i = 0; i < carriers.length; i++){
           this.hist.push([occ[i], carriers[i]]);
       }
   }

   __allids__( ){
      this.ids = [];

      for(var i = 0; i < this.dataset.length; i++){
          this.ids.push(i);
      }
   }

   setSelected(ids){
      this.ids = ids;

      this.__init__( );
      this.show( );
   }

   resetSelected( ){
      this.__allids__( );
      this.__init__( );
      this.show( );
   }
}
