// Store our API endpoint inside queryUrl

// function buildUrl(){
//     const
//         domain = "earthquake.usgs.gov",
//         endpoint = "/fdsnws/event/1/query",
//         format = "geojson",
//         starttime = "2014-01-01",
//         endtime = "2014-01-02",
//         maxLon = -69.52148437,
//         minLon = -123.83789062,
//         maxLat = 48.74894534,
//         minLat = 25.16517337;
//
//     return `https://${domain}${endpoint}?format=${format}&starttime=${starttime}&endtime=${endtime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;
// }

Url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// create radius function
function getRadius(magnitude) {
    return magnitude * 10000;
};

function getColor(magnitude) {
   switch (true) {
   case magnitude > 5:
     return "#ea2c2c";
   case magnitude > 4:
     return "#ea822c";
   case magnitude > 3:
     return "#ee9c00";
   case magnitude > 2:
     return "#eecc00";
   case magnitude > 1:
     return "#d4ee00";
   default:
     return "#98ee00";
   }
}

function createFeatures(earthquakeData) {
  console.log(earthquakeData);

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "Magnitude: " + feature.properties.mag);
          },

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: 1,
              color: "#000",
              stroke: true,
              weight: .1
          })
        }
        });

    myMap = createMap(earthquakes);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background-color:' + getColor(magnitudes[i] + 1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }

        console.log(div);
        return div;
    };

    legend.addTo(myMap);
}


function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
    });


    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Lighth Map": lightmap,
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [lightmap, earthquakes]
    });


    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    // L.control.layers(baseMaps, overlayMaps, {
    //         collapsed: false
    // }).addTo(myMap);
    return myMap
}

(async function(){
    // const queryUrl = buildUrl();
    const data = await d3.json(Url);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);

})()
