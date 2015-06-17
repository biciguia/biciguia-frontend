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


// REFACTOR: ui_address.js or something like that
function hideAddressListOnClick() {
  document.getElementById( "menu" ).onclick = function(){
    hideAddressList("origin");
    hideAddressList("destination");
  }
}

// REFACTOR: lib_routes.js or ui_routes.js
function showRoute() {
  searchRoute = true;
  var routeOptions = {
    option1: $('#option-1').is(':checked'),
    option2: $('#option-2').is(':checked'),
    option3: $('#option-3').is(':checked')
  };
  routeByCoordinates(markers[0]._latlng,markers[1]._latlng, routeOptions);
}

// TODO refactor to reduce coupling
// TODO create more logs to specify if did not choose or if geocoder result was empty
// TODO fix test
// REFACTOR: split into several methods and put each method in its respective ui_*.js file
// REFACTOR: to run the function when the DOM is ready, register like: $(document).ready(functionName);
function onDOMReady() {
  hideAddressListOnClick();

  $("#route-button").click(function() {
    
    if(markers[0] != undefined && markers[1] != undefined) {
      showRoute();
    }
    else if (origin != undefined && destination != undefined) {
      if (markers[0] == undefined) {
        setMarker("origin",origin);
      }
      if (markers[1] == undefined) {
        setMarker("destination",destination);
      }
      showRoute();
    }
    else {
      if (markers[0] == undefined && origin == undefined) {
        if (markers[1] == undefined && destination == undefined)
          alert("Favor escolher origem e destino válidos.");
        else 
          alert("Favor escolher uma origem válida.");
      }
      else if (markers[1] == undefined && destination == undefined) {
          alert("Favor escolher um destino válido.");
      }
    }
  });

  $("#broken-route-confirm-button").click(function(){
    var text = $("#text-broken-route").val();
    var brokenRouteObject = createBrokenRouteObject(text, origin.display_name, destination.display_name, markers[0], markers[1], routeLine);
    var url = 'http://104.131.18.160:8000/reclamacao';
    $.post(url, brokenRouteObject, successfulRequestBrokenRoute());
  });

  $(".address").focusout(showGeocodesAfterEvent);
  $(".address").keyup(keyUpHandler);

  $("#broken-route-button").click(function() {
    brokenRoute();
   });

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

// REFACTOR: ui_routes.js
function brokenRoute(){
  if(!searchRoute){
    alert("Você precisa escolher uma rota antes!");
  }
  else{
    $("#text-broken-route").show();
    $("#broken-route-confirm-button").show();
    $("#broken-route-button").hide();
  }
}

function successfulRequestBrokenRoute(hideAlert){
  $("#text-broken-route").hide();
  $("#text-broken-route").val('');
  $("#broken-route-confirm-button").hide();
  $("#broken-route-button").show();

  if (hideAlert == undefined) {
    alert("Sua reclamação foi enviada! Obrigado pelo feedback!");
  }
}

// REFACTOR: ui_address.js, change name
function showGeocodesAfterEvent(event) {
  var value = $(event.target).val();
  if (!madeRequest) {
    madeRequest = true;
    if (event.target.id == 'origin-address') {
      showGeocodes(value, 'origin');
    } else {
      showGeocodes(value, 'destination');
    }
  }
}

// REFACTOR: lib_misc.js
function isLatLonString(value) {
  if (value.match('^[ ]*[+|-]?[0-9]+([.]([0-9]+))?[ ]*[,][ ]*[+|-]?[0-9]+([.]([0-9]+))?[ ]*$'))
    return true;
  return false;
}

// REFACTOR: ui_address.js
function latLonInput(target) {
  var source = target.id.replace("-address","");
  var value = target.value;
  if (isLatLonString(value)) {
    var latLon = value.split(" ").join("").split(",");
    latLon.lat = latLon[0];
    latLon.lon = latLon[1];
    latLon.display_name = latLon.lat + ", " + latLon.lon;
    setMarker(source,latLon,true);
    return true;
  }
  return false;
}

// REFACTOR: ui_address.js
function keyUpHandler(event) {
  if (latLonInput(event.target)) return;

  var targetId = lastKeypressId + 1;
  lastKeypressId = targetId;

  madeRequest = false;

  setTimeout(function() {
    if (lastKeypressId == targetId) {
      spinner.spin(document.getElementById("spinner"));
      showGeocodesAfterEvent(event);
    }
    // TODO adjust the timeout below
  }, 400);
}

// REFACTOR: ui_address.js, change name (getAndShowGeocodes or similar)
function showGeocodes(address, source) {
  var geoCoderURL = getGeocoderURLFromAddress(address);

  if (geoCoderURL == undefined) {
    hideAddressList(source);
  } else {
    $.get(geoCoderURL, bind2ndArgument(showAddressList, source)).fail(errorCallback);
  }
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

// REFACTOR: ui_address.js, change name (addressSelected or similar)
function menuItemSelected(event, addressesList) {
  var pieces = event.target.id.split('-');
  var source = pieces[0];
  var i = parseInt(pieces[1]);
  var coords = [addressesList[i].lat, addressesList[i].lon];
  setMarker(source,addressesList[i], true);
}

// REFACTOR: ui_address.js
function showAddressList(addresses, source) {
  // filter out results from outside são paulo
  for (var i = 0; i < addresses.length; i++) {
    if (addresses[i].address.city != "São Paulo") {
      addresses.splice(i, 1);
      i--;
    }
  }

  spinner.stop();

  var list = $('#'+source+'-table');
  list.empty();
  list.show();

  var listElements = getAddressListHTML(addresses, source);
  list.append(listElements);
  if (source == "origin")
    origin = addresses[0];
  else if (source == "destination")
    destination = addresses[0];

  $('.'+source+'-suggestion-item').click(bind2ndArgument(menuItemSelected, addresses));
}

// REFACTOR: ui_address.js
function hideAddressList(source) {
  spinner.stop();

  var list = $('#'+source+'-table');
  list.empty();
  list.hide();
}

