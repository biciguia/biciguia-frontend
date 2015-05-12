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

// globals used by the UI code
var madeRequest = false;
var lastKeypressId = 0;
var markers = [undefined, undefined];
var menu = document.getElementById( "menu" );
var origin = undefined, destination = undefined;

init();

//TODO: resolve undefined
function init() {
  menu.onclick = function(){
    hideAddressList("origin");
    hideAddressList("destination");
  }
}

function showRoute() {
  var routeOptions = {
    option1: $('#option-1').is(':checked'),
    option2: $('#option-2').is(':checked'),
    option3: $('#option-3').is(':checked')
  };
  routeByCoordinates(markers[0]._latlng,markers[1]._latlng, routeOptions);
}

// TODO refactor to reduce coupling
// TODO create more logs to specify if did not choose or if geocoder result was empty
function onDOMReady() {
  $("#route-button").click(function() {
    if(markers[0] != undefined && markers[1] != undefined) {
      showRoute();
    }
    else if (origin != undefined && destination != undefined) {
      console.log("will do it");
      if (markers[0] == undefined) {
        console.log("origin updated")
        setMarker("origin",origin);
      }
      if (markers[1] == undefined) {
        console.log("destination updated");
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

  $(".address").focusout(showGeocodesAfterEvent);
  $(".address").keyup(keyUpHandler);
}

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

function keyUpHandler(event) {
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

function showGeocodes(address, source) {
  var geoCoderURL = getGeocoderURLFromAddress(address);

  if (geoCoderURL == undefined) {
    hideAddressList(source);
  } else {
    $.get(geoCoderURL, bind2ndArgument(showAddressList, source)).fail(errorCallback);
  }
}

function setMarker(source, address) {
  var coords = [address.lat, address.lon];
  var zoom = 17;
  $('#'+source+'-address').val(address.display_name);
  hideAddressList(source);
  var markerIdx = 0;
  if(source == "destination") {
    markerIdx = 1;
  }
  if (markers[markerIdx] != undefined ) {
    markers[markerIdx].setLatLng(coords);
    markers[markerIdx].update();
  } else {
    markers[markerIdx] = new L.Marker(coords).addTo(map);
  }

  if (markers[0] != undefined && markers[1] != undefined) {
    var group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds());
  } else {
    map.setView(coords, zoom);
  }

  removeRoute();
}

function menuItemSelected(event, addressesList) {
  var pieces = event.target.id.split('-');
  var source = pieces[0];
  var i = parseInt(pieces[1]);
  var coords = [addressesList[i].lat, addressesList[i].lon];
  setMarker(source,addressesList[i]);
  var zoom = 17;
  $('#'+source+'-address').val(addressesList[i].display_name);
  hideAddressList(source);
  var markerIdx = 0;
  if(source == "destination") {
    markerIdx = 1;
  }
  if (markers[markerIdx] != undefined ) {
    markers[markerIdx].setLatLng(coords);
    markers[markerIdx].update();
  } else {
    markers[markerIdx] = new L.Marker(coords).addTo(map);
  }

  if (markers[0] != undefined && markers[1] != undefined) {
    var group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds());
  } else {
    map.setView(coords, zoom);
  }

  removeRoute();
}

function showAddressList(addresses, source) {
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

function hideAddressList(source) {
  spinner.stop();

  var list = $('#'+source+'-table');
  list.empty();
  list.hide();
}
