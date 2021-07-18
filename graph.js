var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");


var projection = d3.geoMercator()
    .center([0,20])                // GPS of location to zoom on
    .scale(180)                       // This is like the zoom
    .translate([ width/2, height/2 ])

d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")  // World shape
    .defer(d3.csv, "fixed_dataset.csv") // Position of circles
    .await(ready);

function ready(error, dataGeo, data) {

    //console.log(data)
    var valueExtent = d3.extent(data, function(d) { return +d.mass; })
    console.log(valueExtent)
    //d3.scaleSqrt()
    var size = d3.scaleSqrt()
    .domain(valueExtent)  // What's in the data
    .range([ 1, 50])  // Size in pixel



     // Draw the map
    svg.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
    .style("stroke", "none")
    .style("opacity", .3)



    svg
    .selectAll("myCircles")
    .data(data.sort(function(a,b) { return +b.mass - +a.mass }).filter(function(d,i){ return i<1000 }))
    .enter()
    .append("circle")
      .attr("cx", function(d){ return projection([+d.long, +d.latt])[0] })
      .attr("cy", function(d){ return projection([+d.long, +d.latt])[1] })
      .attr("r", function(d){ return size(+d.mass) })
      .style("fill", "red" )
      .attr("stroke-width", 1)
      .attr("fill-opacity", .2)



      
}