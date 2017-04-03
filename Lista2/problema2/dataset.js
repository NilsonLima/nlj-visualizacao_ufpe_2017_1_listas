function getDataset( ){
    var random = d3.randomNormal(0, 0.2),
        sqrt3 = Math.sqrt(3),
        points0 = d3.range(300).map(function() { return [random() + sqrt3, random() + 1, 0]; }),
        points1 = d3.range(300).map(function() { return [random() - sqrt3, random() + 1, 1]; }),
        points2 = d3.range(300).map(function() { return [random(), random() - 1, 2]; });

    return d3.merge([points0, points1, points2]);
}
