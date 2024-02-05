// Create an initial map object
let myMap = L.map("map", {
    center: [37.00, -96.00],
    zoom: 5
});

// create a tile layer that will be the background
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Get data from query URL
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Set a function to determine the marker size
function markerSize(magnitude) {
    return magnitude * 5;
}

// Set colour function to map 
function getColor(depth) {
    switch (true) {
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

// Call features and console log the response
d3.json(url).then(function (Data) {
    console.log(Data.features);

    for (let i = 0; i < Data.features.length; i++) {
        let location = Data.features[i].geometry;

        if (location) {
            let depth = location.coordinates[2];
            let magnitude = Data.features[i].properties.mag;
            let coordinates = [location.coordinates[1], location.coordinates[0]];
            L.circleMarker(coordinates, {
                radius: markerSize(magnitude),
                color: getColor(depth),
                fillColor: getColor(depth),
                fillOpacity: 0.75,
            }).bindPopup(`<p>magnitude: ${magnitude}</p> <p> Depth: ${depth}</p> <p> Location: ${Data.features[i].properties.place}</p>`).addTo(myMap);
        }
    }

    // Create a control with position
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info legend');
        let dep = [-10, 10, 30, 50, 70, 90];

        // loop through and create a colored square for each interval
        for (var i = 0; i < dep.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(dep[i] + 1) + '"> </i> ' +
                dep[i] + (dep[i + 1] ? '&ndash;' + dep[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
});






