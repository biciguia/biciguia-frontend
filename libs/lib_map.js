/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

var map;
var overlays = {};

var overlayFiles = {
  "Ambulatórios": "ambulatorios_de_especialidades.json",
  "Bibliotecas": "bibliotecas.json",
  "Bosques e Pontos de Leitura": "bosques_e_pontos_de_leitura.json",
  "Hospitais": "hospitais.json",
  "Museus": "museus.json",
  "Pronto-Socorros": "pronto-socorros.json",
  "Unidades Básicas de Saúde": "ubs.json"
};

function initializeMap(){
  map = L.map('map').setView([-23.5475, -46.63611], 13);

  map.on("click", mapClicked);

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

function mapClicked(e){
  addSomeMarker(e.latlng.lat,e.latlng.lng);
}

var __count = 0;
function createLeafletMarkers(fileJson, key) {
  var markers = createMarkersArray(fileJson);

  for (var i = 0; i < markers.length; i++) {
    markers[i] = L.marker(markers[i].coords).bindPopup(markers[i].description);
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

