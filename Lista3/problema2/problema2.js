class Treemap{
    constructor(dimensions){
        this.width = dimensions.w;
        this.height = dimensions.h;

        this.stratify = d3.stratify( )
                          .parentId(function(d){ return d.id.substring(0, d.id.lastIndexOf("."))});

        this.treemap = d3.treemap( )
                         .size([dimensions.w, dimensions.h])
                         .padding(1)
                         .round(true);

        this.cScale = d3.scaleOrdinal( )
                        .range(d3.schemeCategory20.map(function(d){ d = d3.rgb(d); d.opacity = 0.7; return d; }))

        this.__orgaos__( );
    }

    show( ){
        var that = this;

        d3.csv("recife-dados-despesas-2015.csv", function(err, data){
            if(err) throw err;

            var obj = that.__pre_process__(data);
            var root = that.stratify(obj)
                           .sum(function(d){ return d.value; })
                           .sort(function(a, b){ b.height - a.height || b.value - a.value; });

            that.treemap(root);
            console.log(root.leaves( ))

            d3.select("body")
              .selectAll(".node")
              .data(root.leaves( ))
              .enter( )
              .append("div")
              .attr("class", "node")
              .attr("title", function(d){ return d.id + "\n" + d.value; })
              .style("left", function(d){ return d.x0 + "px"; })
              .style("top", function(d){ return d.y0 + "px"; })
              .style("width", function(d){ return (d.x1 - d.x0) + "px"; })
              .style("height", function(d){ return (d.y1 - d.y0) + "px"; })
              .style("background", function(d){ return that.cScale(d.id); })
              .append("div")
              .attr("class", "node-label")
              .text(function(d){ return d.id.substring(d.id.lastIndexOf(".") + 1)})
              .append("div")
              .attr("class", "node-value")
              .text(function(d){ return d3.format(",.2f")(d.value); })
        });
    }

    __pre_process__(data){
        var that = this;
        var obj = [{"id": "RECIFE", "value": null}];

        for(var i = 0; i < this.orgaos.length; i++){
            var value = data.filter(function(d){ return d.orgao_nome == that.orgaos[i]; })
                            .map(function(d){ var val = +d.valor_pago; if(!val) val = 0; return val; })
                            .reduce(function(a, b){ return a + b; }, 0);

            obj.push({"id": "RECIFE." + this.orgaos[i], "value": value});
        }

        console.log(data.filter(function(d){ return d.orgao_nome == "SECRETARIA DE ENFRENTAMENTO AO CRACK E OUTRAS DROGAS"; })
                        .map(function(d){ return d.valor_pago; }))

        return obj;
    }

    __orgaos__( ){
        this.orgaos = ['GABINETE DO PREFEITO', 'GABINETE DO VICE-PREFEITO', "SECRETARIA DE EDUCAÇÃO",
                       'SECRETARIA DE MOBILIDADE E CONTROLE URBANO', 'SECRETARIA DE SAÚDE', 'SECRETARIA DE MULHER',
                       'SECRETARIA DE HABITAÇÃO', 'SECRETARIA DE ENFRENTAMENTO AO CRACK E OUTRAS DROGAS',
                       'SECRETARIA DE IMPRENSA', 'SECRETARIA DE JUVENTUDE E QUALIFICAÇÃO PROFISSIONAL'];
    }
}
