class Dataset{
    constructor( ){
        this.__transform__( );
        this.labels = ["nameplate",
                       "generation",
                       "capacityfactor",
                       "co2emissions",
                       "co2emissionsRate"];
    }

    twoby2(x, y){
        var length = this.dataset.length;
        var array = [];

        for(var i = 0; i < length; i++){
            var arr = [this.dataset[i][x],
                       this.dataset[i][y],
                       this.dataset[i][5]];

            array.push(arr);
        }

        return array;
    }

    __transform__( ){
        var length = egrid.length;
        var array = [];

        for(var i = 0; i < length; i++){
            var arr = [egrid[i]["nameplate"],
                       egrid[i]["generation"],
                       egrid[i]["capacityfactor"],
                       egrid[i]["co2emissions"],
                       egrid[i]["co2emissionsRate"],
                       egrid[i]["fuel"]];

            array.push(arr);
        }

        this.dataset = array;
    }
}
