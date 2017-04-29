class Map{
  constructor(dimensions, container){
      var that = this;

      this.width = dimensions.w;
      this.height = dimensions.h;
      this.container = container;

      this.canvas = container.append("g");

      this.tooltip = d3.select("body")
                       .append("div")
                       .attr("class", "tooltip")
                       .style("opacity", 0);

      this.scale0 = dimensions.w * 4 / Math.PI;

      this.projection = d3.geoAlbersUsa( )
                          .translate([dimensions.w / 2, dimensions.h / 2])
                          .scale([this.scale0]);

      this.path = d3.geoPath( )
                    .projection(this.projection);

      this.zoom = d3.zoom( )
                    .scaleExtent([1, 12])
                    .on("zoom", function(){ that.__zoomed__( ); });
  }

  show( ){
      var that = this;
      this.canvas.call(this.zoom);

      d3.csv("us-productivity.csv", function(err, csv){
         if(!err){
             that.cScale = d3.scaleLinear( )
                             .domain([0, d3.max(csv, function(d){ return d.value; })])
                             .range([0, 1]);

             d3.json("us-states.json", function(err, json){
                 if(!err){
                     for(var i = 0; i < csv.length; i++){
                         var csv_state = csv[i].state;
                         var csv_value = Number(csv[i].value);

                         for(var j = 0; j < json.features.length; j++){
                             var state = json.features[j].properties.name;

                             if(csv_state == state){
                                 json.features[j].properties.value = csv_value;
                                 break;
                             }
                         }
                     }

                     that.canvas.selectAll("path")
                                   .data(json.features)
                                   .enter()
                                   .append("path")
                                   .attr("d", that.path)
                                   .on("mousemove", function(d){
                                        that.tooltip.transition( )
                                                    .duration(100)
                                                    .style("opacity", .8);

                                        that.tooltip.html(d.properties.name + "</br>" + d.properties.value)
                                                    .style("left", d3.event.pageX + "px")
                                                    .style("top", (d3.event.pageY - 60) + "px");
                                   })
                                   .on("mouseout", function(d){
                                        that.tooltip.transition( )
                                                    .duration(500)
                                                    .style("opacity", 0);
                                   })
                                   .on("contextmenu", function(){ that.__zoom_out__( ); })
                                   .style("fill", function(d){ return d3.interpolateYlOrRd(that.cScale(d.properties.value)); });
                 }
             });
         }
      });

      d3.select(self.frameElement).style("height", this.height + "px");
  }

  __zoomed__( ){
      var t = d3.event.transform;

      this.projection.translate([t.x + (t.k * this.width)/2, (t.k * this.height)/2 + t.y])
                     .scale([t.k * this.scale0]);

      this.canvas.selectAll("path")
                 .attr("d", this.path);
  }
   __zoom_out__( ){
      var t = d3.event.button;

      if(t == 2){
          this.canvas.call(this.zoom.transform, d3.zoomIdentity);
          d3.event.preventDefault( );
      }
   }
}
