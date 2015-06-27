/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

$(document).ready(initializeMap);
function initializeMap() {
  if (document.getElementById('map') === null) return;

  L.mapbox.accessToken = 'pk.eyJ1IjoiYmljaWd1aWFzcGZhYmlvIiwiYSI6ImQyYmI4YmM5MGQ2ZTk5MmI3MjY2N2UxYjVlZDYwMDVjIn0.stEthE-G_AT1ejVvagtCnA';
  //L.mapbox.accessToken = 'pk.eyJ1IjoianVzdHRlc3RpbmciLCJhIjoiMEg3ZWJTVSJ9.h41984pPh9afTYWBg2eoQQ';

  map = L.map('map',{
    // TODO change
    maxBounds: coordsToLeafletBounds(maxBounds),
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
    var curBounds_L = map.getBounds();
    var curBounds = {
      bottom: curBounds_L.getSouthWest().lat,
      left: curBounds_L.getSouthWest().lng,
      top: curBounds_L.getNorthEast().lat,
      right: curBounds_L.getNorthEast().lng,
    };
    var coords = ensureMapViewBounds(curBounds);
    map.fitBounds(coordsToLeafletBounds(coords));
  });

  $("#location-button").click(function() {
    mixpanel.track("geolocationButton");
    navigator.geolocation.getCurrentPosition(getGeolocation, errorGeolocation);
  });

  navigator.geolocation.getCurrentPosition(getGeolocation, errorGeolocation);

  // REFACTOR: split into its own function?
  for (var key in overlayFiles) {
    if (overlayFiles.hasOwnProperty(key)) {
      $.getJSON('assets/overlays/'+overlayFiles[key],
        bind2ndArgument(createLeafletMarkers, key)).fail(errorCallback);
    }
  }

  //add an OpenStreetMap tile layer
  // L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  //     }).addTo(map);
     var accessToken = 'pk.eyJ1IjoianVzdHRlc3RpbmciLCJhIjoiMEg3ZWJTVSJ9.h41984pPh9afTYWBg2eoQQ';

     L.tileLayer('http://{s}.tiles.mapbox.com/v4/' + 'justtesting.bb599507' + '/{z}/{x}/{y}.png?access_token=' + accessToken, {
         attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
     }).addTo(map);




//
// var map = L.map('map', 'mapbox.streets')
//     .setView([-23.5475, -46.63611], 16);


}

function coordsToLeafletBounds(coords) {
  var bounds = L.latLngBounds(L.latLng(coords.bottom, coords.left),
      L.latLng(coords.top, coords.right));
  return bounds;
}

function ensureMapViewBounds(currentBounds) {
  if (currentBounds.bottom < maxBounds.bottom) currentBounds.bottom = maxBounds.bottom;
  if (currentBounds.left < maxBounds.left) currentBounds.left = maxBounds.left;
  if (currentBounds.top > maxBounds.top) currentBounds.top = maxBounds.top;
  if (currentBounds.right > maxBounds.right) currentBounds.right = maxBounds.right;
  return currentBounds;
}

// REFACTOR: change name
function getGeolocation(position){
  var address = [];
  address.lat = position.coords.latitude;
  address.lon = position.coords.longitude;
  address.display_name = address.lat.toFixed(5) + ", " + address.lon.toFixed(5);

  setMarker('origin', address, true);
}

// TODO: change alert() to something less intrusive?
function errorGeolocation(error){
  if(error.code != error.PERMISSION_DENIED)
    alert("Falha ao buscar sua geolocalização");
}

// REFACTOR: change name
function mapClicked(e, source){
  var address = [];
  mixpanel.track("mapClicked-"+source);
  address.lat = e.latlng.lat;
  address.lon = e.latlng.lng;
  address.display_name = address.lat.toFixed(5) + ", " + address.lon.toFixed(5);

  setMarker(source, address);
  getAndShowRoute();
}

function getIcon(key) {
  if (key !== undefined){
    overlayIcons[key] = L.MakiMarkers.icon({icon: overlayIcons[key], color: "#b0b", size: "l"});
    return overlayIcons[key];
  } else {
    return undefined;
  }
}

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

// TODO: use this for preprocessing the json files (issue #31)
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
