// Set variable for url 
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

function createMap(earthquakeData) {
    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold the earthquake layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Magnitude": magnitude
    };

    // Create the map object with options
    var map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 3,
        layers: [lightmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response) {

    // Pull the "earthquakes" property off of response.data
    var earthquakeFeatures = response.data.earthquakeFeatures;

    // Initialize an array to hold the markers
    var earthquakeMarkers = [];
    var magnitudeMarkers = [];

    // Loop through the earthquakeFeatures array
    for (var index = 0; index < earthquakeFeatures.length; index++) {
        var feature = earthquakeFeatures[index];

        // For each earthquakeFeatures, create a marker and bind a popup with the earthquakeFeatures' name
        var earthquakeMarker = L.marker([feature.lat, feature.lon])
            .bindPopup("<h3>" + feature.name + "<h3><h3>Magnitude: " + feature.capacity + "</h3>");

        // Add the marker to the earthquakeMarkers array
        earthquakeMarkers.push(earthquakeMarker);
    }

    // Create a layer group made from the earthquakeMarkers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
}


// Perform an API call to the Earthquake API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson", createMarkers);