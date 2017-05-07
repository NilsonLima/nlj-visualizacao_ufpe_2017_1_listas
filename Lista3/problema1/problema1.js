class ForceGraph{
    constructor(dimensions, container){
        this.width = dimensions.w;
        this.height = dimensions.h;

        this.container = container;
        this.canvas = container.append("g");

        this.cScale = d3.scaleOrdinal(d3.schemeCategory10);

        this.simulation = d3.forceSimulation( )
                            .force("link", d3.forceLink( ).id(function(d){ return d.id; }))
                            .force("charge", d3.forceManyBody( ))
                            .force("center", d3.forceCenter(dimensions.w / 2, dimensions.h / 2));

        this.linksg = this.canvas.append("g").attr("class", "links");
        this.nodesg = this.canvas.append("g").attr("class", "nodes");

        this.__legend__( );
    }

    show(n){
        var that = this;
        this.__graph__(n);

        this.links = this.linksg.selectAll("line")
                                .data(this.graph.links);

        this.nodes = this.nodesg.selectAll("circle")
                                .data(this.graph.nodes);

        this.links.exit( ).remove( );

        this.nodes.exit( ).remove( );

        this.links = this.links.enter( )
                              .append("line")
                              .merge(this.links)
                              .attr("stroke-width", function(d){ return Math.sqrt(d.value); });

        this.nodes = this.nodes.enter( )
                               .append("circle")
                               .merge(this.nodes)
                               .attr("r", 5)
                               .attr("fill", function(d){ return that.cScale(d.group); })
                               .call(d3.drag( )
                                  .on("start", function(d){ that.__drag_start__(d); })
                                  .on("drag", function(d){ that.__drag__(d); })
                                  .on("end", function(d){ that.__drag_end__(d); }));

        this.nodes.append("title")
                  .text(function(d){ return d.id; });

        this.simulation.nodes(this.graph.nodes)
                       .on("tick", function( ){ return that.__tick__( ); });

        this.simulation.force("link")
                       .links(this.graph.links);

        this.simulation.alpha(0.3).restart( );

    }

    __graph__(n){
        var that = this;
        var arr = [], nodes = [], links = [];

        for(var i = 0; i < iris.length; i++){

            for(var j = 0; j < iris.length; j++){
                if(i != j)
                    arr.push([that.__euclidean__(iris[i], iris[j]), j])
            }

            arr.sort(function(a, b){ return a[0] - b[0]; });
            nodes.push({"id": i, "group": iris[i].species});

            for(var w = 0; w < n; w++){
                var flag = false;

                for(var x = 0; x < links.length; x++){
                    if(links[x].target == i && links[x].source == arr[w][1]){
                        flag = true;
                        break;
                    }
                }

                if(!flag)
                    links.push({"source": i, "target": arr[w][1], "value": arr[w][0]});
            }

            arr = [];
        }

        this.graph = {"nodes": nodes, "links": links};
    }

    __euclidean__(p, q){
        var a = Math.pow(p.sepal_length - q.sepal_length, 2),
            b = Math.pow(p.sepal_width - q.sepal_width, 2),
            c = Math.pow(p.petal_length - q.petal_length, 2),
            d = Math.pow(p.petal_width - q.petal_width, 2)

        return Math.sqrt(a + b + c + d);
    }

    __drag__(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    __drag_start__(d){
        if(!d3.event.active)
          this.simulation.alphaTarget(0.3).restart( );

        d.fx = d.x;
        d.fy = d.y;
    }

    __drag_end__(d){
        if(!d3.event.active)
            this.simulation.alphaTarget(0);

        d.fx = null;
        d.fy = null;
    }

    __tick__( ){
        this.links.attr("x1", function(d){ return d.source.x; })
                  .attr("y1", function(d){ return d.source.y; })
                  .attr("x2", function(d){ return d.target.x; })
                  .attr("y2", function(d){ return d.target.y; });

        this.nodes.attr("cx", function(d){ return d.x; })
                  .attr("cy", function(d){ return d.y; });
    }

    __legend__( ){
        var that = this;
        var margin = {top: 15, left: 20};
        var species = Array.from(new Set(iris.map(function(d){ return d.species; })));

        var legend = this.canvas.append("g")
                                .attr("transform", "translate(" + margin.left + ","
                                                                + margin.top + ")");

        legend.append("g")
              .selectAll("circle")
              .data(species)
              .enter( )
              .append("circle")
              .attr("r", 5)
              .attr("cx", 0)
              .attr("cy", function(d, i){ return i * 20; })
              .attr("fill", function(d){ return that.cScale(d)});

        legend.append("g")
              .selectAll("text")
              .data(species)
              .enter( )
              .append("text")
              .attr("x", 20)
              .attr("y", function(d, i){ return (i * 20) + 4; })
              .attr("fill", function(d){ return that.cScale(d); })
              .attr("font-family", "sans-serif")
              .text(function(d){ return d; });

    }
}
