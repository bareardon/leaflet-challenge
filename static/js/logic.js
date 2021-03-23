function createMap(earthquakes) {
      // Define lightmap and streetmap layers
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
      });
    
    var streetmap =   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap,
        "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the earthquake layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map object with options
    var map = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [lightmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 11, 31, 51, 71, 91],
            labels = ["-10-10 km", "10-30 km", "30-50 km", "30-50 km", "70-90 km", "90+ km"];

        div.innerHTML = "<div> </div>"
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i]) + '"></i>' + labels[i]+ '<br/>';
        }

        return div;
};

    legend.addTo(map);
}

// Create function to choose colors by earthquake depth 
function chooseColor(depth) {
    switch(true) {
        case depth > 90:
            return "#FF0000";
        case depth > 70:
            return "#ff6600";
        case depth > 50:
            return "#ff9900";
        case depth > 30:
            return "#FFCC00";
        case depth > 10:
            return "#FFFF00";
        default:
            return "#00FF00";
    }
}

function createMarkers(response) {

    // Pull the "earthquakes" property off of response.data
    var features = response.features;
    // console.log(features)

    // Initialize an array to hold the markers
    var earthquakeMarkers = [];

    // Loop through the features array
    for (var index = 0; index < features.length; index++) {
        var feature = features[index];
        // console.log(feature)

        // For each earthquakeFeatures, create a marker and bind a popup with the earthquakeFeatures' name
        var earthquakeMarker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            color: "white",
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.5,
            weight: 1.5,
            radius: feature.properties.mag
        }).bindPopup("<h3>" + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "</h3><h3>Depth: " + feature.geometry.coordinates[2]+ "</h3>");

        // Add the marker to the earthquakeMarkers array
        earthquakeMarkers.push(earthquakeMarker);
    }
    // console.log(earthquakeMarkers)
    var layer = new L.layerGroup(earthquakeMarkers);
    
    // Create a layer group made from the earthquakeMarkers array, pass it into the createMap function
    createMap(layer);
}


// Perform an API call to the Earthquake API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
