/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

// REFACTOR: split into multiple files and remove ui_nominatim.js

// globals used by the UI code
var madeRequest = false;
var lastKeypressId = 0;
var markers = [undefined, undefined];
var origin = undefined, destination = undefined;
var originConfigured = false;

// TODO refactor to reduce coupling
// TODO create more logs to specify if did not choose or if geocoder result was empty
// TODO fix test
// REFACTOR: split into several methods and put each method in its respective ui_*.js file
// REFACTOR: to run the function when the DOM is ready, register like: $(document).ready(functionName);
function onDOMReady() {
  hideAddressListOnClick();

  $(".address").focusout(showGeocodesAfterEvent);
  $(".address").keyup(keyUpHandler);

  $("#location-button").click(function() {
    navigator.geolocation.getCurrentPosition(getGeolocation, errorGeolocation);
  });

  // TODO: replace this with *actual code* for showing/hiding multiple screens
  // window.addEventListener('resize', function(evt) {
  //   var mapElem = $('#map-wrapper');
  //   if ($(window).width() > 992) {
  //     if (!mapElem.is(":visible")) {
  //       mapElem.toggle();
  //     }
  //   } else {
  //     var menuElem = $('#menu');
  //     if (menuElem.is(":visible")) {
  //       if (mapElem.is(":visible")) {
  //         menuElem.show();
  //         mapElem.hide();
  //       }
  //     } else {
  //       if (!mapElem.is(":visible")) {
  //         menuElem.show();
  //       }
  //     }
  //   }
  // });

}

// REFACTOR: ui_map.js, split into smaller functions?
function setMarker(source, address, zoomIn) {
  var coords = [address.lat, address.lon];
  var zoom = 17;
  var element = $('#'+source+'-address');
  if (element.val() != address.display_name) {
    element.val(address.display_name);
  }
  hideAddressList(source);
  var markerIdx = 0;
  if(source == "destination") {
    markerIdx = 1;
  }
  // REFACTOR: this could be a function maybe?
  if (markers[markerIdx] != undefined ) {
    markers[markerIdx].setLatLng(coords);
    markers[markerIdx].update();
  } else {
    markers[markerIdx] = new L.Marker(coords).addTo(map);
  }

  // REFACTOR: this could be another?
  if (markers[0] != undefined && markers[1] != undefined) {
    var group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds());
  } else if (zoomIn) {
    map.setView(coords, zoom);
  }

  if (source == "origin") {
    originConfigured = true;
    origin = address;
  } else { // (source == "destination")
    originConfigured = false;
    destination = address;
  }

  removeRoute();
  searchRoute = false;
}

