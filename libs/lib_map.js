/*
   Copyright © 2015 Biciguia Team

   Biciguia is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Biciguia is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>
   */

var map;
var overlays = {};

function initializeMap(){
  map = L.map('map').setView([-23.5475, -46.63611], 13);

  var overlayFiles = {
    "Ambulatórios": "ambulatorios_de_especialidades.json",
    "Bibliotecas": "bibliotecas.json",
    "Bosques e Pontos de Leitura": "bosques_e_pontos_de_leitura.json",
    "Hospitais": "hospitais.json",
    "Museus": "museus.json",
    "Pronto-Socorros": "pronto-socorros.json",
    "Unidades Básicas de Saúde": "ubs.json"
  };

  for (var key in overlayFiles) {
    if (overlayFiles.hasOwnProperty(key)) {
      var count = 1;
      (function(key){
        $.getJSON('../assets/overlays/'+overlayFiles[key],
            function(data) {
              var markers = createJsonMarkers(data);
              for (var i = 0; i < markers.length; i++) {
                markers[i] = L.marker(markers[i].coords).bindPopup(markers[i].description);
              }
              overlays[key] = L.layerGroup(markers);
              count++;
              if (count == Object.keys(overlayFiles).length) {
                L.control.layers(undefined, overlays).addTo(map);
                count = undefined;
              }
            }
          ).fail(errorCallback);
      })(key);
    }
  }

  // add an OpenStreetMap tile layer
  L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

}

function createJsonMarkers(fileJson) {
  var markers = [];
  for (var i = 0; i < fileJson.length; i++) {
    var place = fileJson[i];

    var marker = {
      "coords": [place.latitude, place.longitude],
      "description": place.nome + "\n" + place.descricao
    };

    markers.push(marker);
  }

  return markers;
}

