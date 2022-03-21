var myMap = L.map('map',{
    center:[38.08, -105.09],
    zoom: 4.5
})

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);
 
var geojsonurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(geojsonurl).then(function(data){

    L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
    
            return L.circleMarker(latlng, {
                radius: magRadius(feature.properties.mag), 
                fillColor: magColor(feature.properties.mag), 
                color: "#000",
                weight: 0.8,
                opacity: 0.5,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h2>${feature.properties.place}</h2><hr><strong>Magnitude: ${feature.properties.mag}</strong>`)
        }
    }).addTo(myMap);

    function magColor(magnitude){
        if (magnitude <= 1) {
            return '#7efb61'
        } else if (magnitude <= 2) {
            return '#f7f758'
        } else if (magnitude <= 3) {
            return '#fba61d'
        } else if (magnitude <= 4) {
            return '#f74848' 
        } else if (magnitude <= 5) {
            return '#ff0000'
        } else if (magnitude > 5) {
            return '#bb5bfb'
        } else {
            return '#eeeeee'
        }
    };
    
    function magRadius(magnitude){
        if (magnitude <= 1) {
            return 4
        } else if (magnitude <= 2) {
            return 6
        } else if (magnitude <= 3) {
            return 8
        } else if (magnitude <= 4) {
            return 10
        } else if (magnitude <= 5) {
            return 12
        } else if (magnitude > 5) {
            return 14
        } else {
            return 1
        }
    }
    
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5]
        var legendTitle = "<h3>Magnitude Level</h3><hr>"
        
        div.innerHTML = legendTitle
        
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML += '<i style="background:' + magColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
});