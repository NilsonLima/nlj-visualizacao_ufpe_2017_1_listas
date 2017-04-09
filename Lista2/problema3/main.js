class Main{
    constructor(container, width, height, n){
        this.container = container.append("g");
        this.width = width;
        this.height= height;
        this.n = n;

        this.__matrix__( );
        this.__dispatch__( );
    }

    __matrix__( ){
        this.matrix = [];
        var w = 0;
        var i, j;

        for(i = 0; i < this.n; i++){
            var dy = (this.height / this.n) * i;
            var arr = [];

            for(j = 0; j < this.n; j++, w++){
                var dx = (this.width / this.n) * j;

                var dimensions = {x: dx, y: dy, width: (this.width/this.n),
                                  height: (this.height/this.n), container: this.container};
                var brushing = {std: false, zoom: false};
                var dispatch = {id: w, flag: true};

                arr.push(new ScatterPlot(dimensions, brushing, dispatch));
            }

            this.matrix.push(arr);
        }
    }

    __dispatch__( ){
        var that = this;
        var dset = d3.dispatch("setSelection");
        var dreset = d3.dispatch("resetSelection");

        dset.on("setSelection", function( ){
                                        for(var i = 0; i < that.n; i++){
                                            for(var j = 0; j < that.n; j++){
                                                if(that.matrix[i][j].id != this.caller){
                                                    that.matrix[i][j].setSelected(this.ids);
                                                }
                                            }
                                        }
                                    });

        dreset.on("resetSelection", function( ){
                                         for(var i = 0; i < that.n; i++){
                                             for(var j = 0; j < that.n; j++){
                                                 if(that.matrix[i][j].id != this.caller){
                                                     that.matrix[i][j].resetSelected( );
                                                 }
                                             }
                                         }

                                    });

        for(var i = 0; i < this.n; i++){
            for(var j = 0; j < this.n; j++){
                this.matrix[i][j].dset = dset;
                this.matrix[i][j].dreset = dreset;
            }
        }
    }

    show( ){
        var i, w, j;
        this.dataset = new Dataset( );

        for(i = this.n - 1, w = 0; i >= 0; i--, w++){
            for(j = 0; j < this.n; j++){
                this.matrix[w][j].imshow(this.dataset.twoby2(j, i));
            }
        }

        for(i = 0; i < this.n; i++){
            var g = {tickx : this.height - 30, ticky : this.width};
            this.matrix[this.n - 1][i].ax({x: true, y: false}, g, ".0s");
        }

        for(i = 0; i < this.n; i++){
            var g = {tickx : this.height - 30, ticky : this.width};
            this.matrix[i][0].ax({x: false, y: true}, g, ".0s");
        }

        for(i = 0; i < this.n; i++){
            for(j = 0; j < this.n; j++){
                this.matrix[i][j].show( );
            }
        }
    }

    legend( ){
        var i, j;

        for(i = this.n - 1, j = 0; i >= 0; i--, j++){
            this.matrix[j][i].legend(this.dataset.labels[j]);
        }
    }
}
