class Main{
    constructor(c, w, h){
        var d1 = {x: 500, y: 0, width: w - 500, height: h, container: c};
        var d2 = {x: 0, y: 0, width: w - 500, height: h, container: c};
        var p1 = {id: "scatter", flag: true};
        var p2 = {id: "hist", flag: true};
        var b = {std: false, zoom: false};

        this.trips = new Dataset( );
        this.plt = new ScatterPlot(d1, b, p1);
        this.hist = new Histogram(d2, p2, this.trips.dataset);

        this.__dispatch__( );
    }

    show( ){
        this.plt.imshow(this.trips.dataset);
        this.plt.ax({x: true, y: true}, null, "");
        this.plt.show( );

        this.hist.show( );
    }

    __dispatch__( ){
        var that = this;
        var dset = d3.dispatch("setSelection");
        var dreset = d3.dispatch("resetSelection");

        dset.on("setSelection", function( ){
                                        if(this.caller == "scatter"){
                                            that.hist.setSelected(this.ids);
                                        }
                                        else{
                                            that.plt.setSelectedHist(this.ids, this.on);
                                        }
                                    });

        dreset.on("resetSelection", function( ){
                                        if(this.caller == "scatter"){
                                            that.hist.resetSelected(this.ids);
                                        }
                                   });

        this.plt.dset = dset;
        this.plt.dreset = dreset;
        this.hist.dset = dset;
    }
}
