// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([-23.5475, -46.63611], 13);

// add an OpenStreetMap tile layer
L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add a marker in the given location, attach some popup content to it and open the popup
L.marker([-23.5475, -46.63611]).addTo(map)
    .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
    .openPopup();