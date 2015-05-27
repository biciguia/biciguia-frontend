/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

var map;
var overlays = {};
var maxBounds = null;

var iconSize = 24; //TODO: iconSize 12 and 18.
var LeafIcon = L.Icon.extend({
    options: {
        //shadowUrl: 'leaf-shadow.png',
        iconSize:     [iconSize, iconSize],
        shadowSize:   [iconSize, iconSize],
        iconAnchor:   [iconSize/2, iconSize/2],
        shadowAnchor: [iconSize/2, iconSize/2],
        popupAnchor:  [-3, -iconSize]
    }
});

var overlayFiles = {
  "Ambulatórios": "ambulatorios_de_especialidades.json",
  "Bibliotecas": "bibliotecas.json",
  "Bosques e Pontos de Leitura": "bosques_e_pontos_de_leitura.json",
  "Hospitais": "hospitais.json",
  "Museus": "museus.json",
  "Pronto-Socorros": "pronto-socorros.json",
  "Unidades Básicas de Saúde": "ubs.json"
};

var overlayIcons = {
  "Ambulatórios": "../assets/icons/src/lodging",
  "Bibliotecas": "../assets/icons/src/town-hall",
  "Bosques e Pontos de Leitura": "../assets/icons/src/library",
  "Hospitais": "../assets/icons/src/city",
  "Museus": "../assets/icons/src/museum",
  "Pronto-Socorros": "../assets/icons/src/hospital",
  "Unidades Básicas de Saúde": "../assets/icons/src/heart"
};

function initializeMap(){
  map = L.map('map',{
    maxBounds: getMaxBounds(),
    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
      text: 'Definir como origem',
      callback: bind2ndArgument(mapClicked, "origin"),
    },
    {
      text: 'Definir como destino',
      callback: bind2ndArgument(mapClicked, "destination"),
    },
    ]
  }).setView([-23.5475, -46.63611], 13);

  //TODO: update unit tests.
  map.on('zoomend', function(e) {
    ensureMapViewBounds(map.getBounds());
  });

  for (var key in overlayFiles) {
    if (overlayFiles.hasOwnProperty(key)) {
      $.getJSON('../assets/overlays/'+overlayFiles[key],
        bind2ndArgument(createLeafletMarkers, key)).fail(errorCallback);
    }
  }

  // add an OpenStreetMap tile layer
  L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
}

//TODO: unit tests.
function getMaxBounds() {
  if (maxBounds != null)
    return maxBounds;
  var bottom = -24.317;
  var left = -47.357;
  var top = -23.125;
  var right = -45.863;
  var southWest = L.latLng(bottom, left);
  var northEast = L.latLng(top, right);
  maxBounds = L.latLngBounds(southWest, northEast)
  return maxBounds;
}

//TODO: unit tests.
function ensureMapViewBounds(currentBounds) {
  var maxBounds = getMaxBounds();
  var maxBoundsBottom = maxBounds.getSouthWest().lat;
  var maxBoundsLeft = maxBounds.getSouthWest().lng;
  var maxBoundsTop = maxBounds.getNorthEast().lat;
  var maxBoundsRight = maxBounds.getNorthEast().lng;
  var bottom = currentBounds.getSouthWest().lat;
  var left = currentBounds.getSouthWest().lng;
  var top = currentBounds.getNorthEast().lat;
  var right = currentBounds.getNorthEast().lng;
  if (bottom < maxBoundsBottom) bottom = maxBoundsBottom;
  if (left < maxBoundsLeft) left = maxBoundsLeft;
  if (top > maxBoundsTop) top = maxBoundsTop;
  if (right > maxBoundsRight) right = maxBoundsRight;
  var newSouthWest = L.latLng(bottom, left);
  var newNorthEast = L.latLng(top, right);
  var newBounds = L.latLngBounds(newSouthWest, newNorthEast);
  map.fitBounds(newBounds);
}

function mapClicked(e, source){
  var address = [];
  address.lat = e.latlng.lat;
  address.lon = e.latlng.lng;
  address.display_name = address.lat.toFixed(5) + ", " + address.lon.toFixed(5);

  setMarker(source, address);
}

function getIcon(key) {
  overlayIcons[key] = overlayIcons[key] + "-" + iconSize + ".svg";
  return new LeafIcon({iconUrl: overlayIcons[key]});
}

var __count = 0;
function createLeafletMarkers(fileJson, key) {
  var markers = createMarkersArray(fileJson);

  var markerIcon = getIcon(key);
  for (var i = 0; i < markers.length; i++) {  
    markers[i] = L.marker(markers[i].coords, {icon: markerIcon}).bindPopup(markers[i].description);
  }

  overlays[key] = L.layerGroup(markers);
  __count++;
  if (__count == Object.keys(overlayFiles).length) {
    L.control.layers(undefined, overlays).addTo(map);
    __count = undefined;
  }
}

function createMarkersArray(fileJson) {
  var markers = [];
  for (var i = 0; i < fileJson.length; i++) {
    var place = fileJson[i];

    var marker = {
      "coords": [place.latitude, place.longitude],
      "description": "<h2>" + place.nome + "</h2><p>" + place.descricao + "</p>",
    };

    markers.push(marker);
  }

  return markers;
}

