let baseMaps = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

// stored URL for GeoJSON data website 
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create a map object for leaflet
let map = L.map("map",{
    center: [40,-85],
    zoom: 4,
});

baseMaps.addTo(map);

// define earthquakes and tectonic plate for layergroups on map
// ---!Magnitude = radius and depth = colors!---
d3.json(url).then(function (data){
    function color_depth(depth){
        switch (true){
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#ea822c";
            case depth > 50:
                return "#ee9c00";
            case depth > 30:
                return "#eecc00";
            case depth > 10:
                return "#d4ee00";
            default: 
                return "#98ee00";
        }

    }
    function radius_magnitude(magnitude){
        if (magnitude === 0){
            return 1;
        }
        return magnitude * 4;


    }
    function styling(feature){
        return{
            radius: radius_magnitude(feature.properties.mag),
            fillColor: color_depth(feature.geometry.coordinates[2]),
            color: "#000000",
            opacity: 1,
            fillOpacity: 1,
            weight: 0.5

        };
    }
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        style: styling, 
        onEachFeature: function(feature, layer){
            layer.bindPopup(
                "Mangitude: " + feature.properties.mag
                + "<br> Depth: " + feature.geometry.coordinates[2]
                + "<br> Location: " + feature.properties.place
            );
        }

    }).addTo(map);
    //Legend
    let legend = L.control({position: "upperright"});
    legend.addOn = function(myMap){
        //Color/text data
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h5>Depth Color Legend </h5>";
        div.innerHTML += '<i style="background: red"></i<span>(Depth > 90) </span><br>';
        div.innerHTML += '<i style="background: orange"></i<span>(90 < Depth <= 70) </span><br>';
        div.innerHTML += '<i style="background: orange"></i<span>(70 < Depth <= 50) </span><br>';
        div.innerHTML += '<i style="background: orange"></i<span>(50 < Depth <= 30) </span><br>';
        div.innerHTML += '<i style="background: orange"></i<span>(Depth < 10) </span><br>';
    return div;
    };

    Legend.addTo(map);
});