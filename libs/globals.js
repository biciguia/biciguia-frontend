/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

// address and UI globals (ui_address.js)
var lastKeypressId = 0;
var markers = [undefined, undefined];
var origin, destination;
var originConfigured = false;


// map globals (lib_map.js)
var map;
var maxBounds = {
  bottom: -24.317,
  left: -47.357,
  top: -23.125,
  right: -45.863,
};


// icon globals (lib_map.js)
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


// overlay globals (lib_map.js)
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
var overlayIcons = {
  "Ambulatórios": "lodging",
  "Bibliotecas": "town-hall",
  "Bosques e Pontos de Leitura": "library",
  "Hospitais": "city",
  "Museus": "museum",
  "Pronto-Socorros": "hospital",
  "Unidades Básicas de Saúde": "heart"
};
var __count = 0;


// route globals (lib_route.js, ui_route.js)
var elev = false;
var routeLine = false;


// spinner (lib_misc.js)
var spinner;
