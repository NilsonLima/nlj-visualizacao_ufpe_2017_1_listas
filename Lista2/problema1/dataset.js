class Dataset{
    constructor( ){
        this.labels = ["Gol", "Tam", "Azul"];
        this.__process__( );
    }

    __process__( ){
        var length = trips.length;
        this.dataset = [];

        for(var i = 0; i < length; i++){

            var post = trips[i].post.split("/");
            var start = trips[i].start.split("/");
            var price = trips[i].price;
            var carrier = trips[i].carrier;

            var oneday = 24 * 60 * 60 * 1000;
            var d1 = new Date(post[2], post[1] - 1, post[0]);
            var d2 = new Date(start[2], start[1] - 1, start[0]);
            var diff = Math.round(Math.abs((d1.getTime( ) - d2.getTime( ))/(oneday)));

            this.dataset.push([diff, price, carrier]);
        }
    }
}
