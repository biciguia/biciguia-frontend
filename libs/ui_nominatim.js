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
var markerOrigin;
var markerDestination;

function onDOMReady() {
  $("#route-button").click(function() {
    // TODO calculate route and display info
    console.log("Button clicked");
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
      showGeocodesAfterEvent(event);
    }
    // TODO adjust the timeout below
  }, 1000);
}

function showGeocodes(address, source) {
  var geoCoderURL = getGeocoderURLFromAddress(address);

  if (geoCoderURL == undefined) {
    hideAddressList(source);
  } else {
    $.get(geoCoderURL,
      bind2ndArgument(showAddressList, source)
    ).fail(errorCallback);
  }
}

function menuItemSelected(event, addressesList) {
  var pieces = event.target.id.split('-');
  var source = pieces[0];
  var i = parseInt(pieces[1]);
  var coords = [addressesList[i].lat, addressesList[i].lon];
  $('#'+source+'-address').val(addressesList[i].display_name);
  hideAddressList(source);
  if(source == "origin"){
    if (markerOrigin != undefined )
    {
      markerOrigin.setLatLng(coords);
      markerOrigin.update();
    }
    else markerOrigin = new L.Marker(coords).addTo(map);
  }
  else
  {
     if (markerDestination != undefined )
    {
      markerDestination.setLatLng(coords);
      markerDestination.update();
    }
    else markerDestination = new L.Marker(coords).addTo(map);
  }
  map.setView(coords);
  var deltaLat = markerDestination.getLatLng().lat - markerOrigin.getLatLng().lat;
  var deltaLng = markerDestination.getLatLng().lng - markerOrigin.getLatLng().lng;
  if (markerOrigin != undefined && markerDestination != undefined && markerOrigin!=markerDestination)
    map.setView([markerOrigin.getLatLng().lat + deltaLat/2, markerOrigin.getLatLng().lng + deltaLng/2]);
}

function showAddressList(addresses, source) {
  var list = $('#'+source+'-table');
  list.empty();
  list.show();
  var heading = $('#'+source+'-heading');
  heading.show();

  var listElements = getAddressListHTML(addresses, source);
  list.append(listElements);

  $('.'+source+'-suggestion-item').click(bind2ndArgument(menuItemSelected, addresses));
}

function hideAddressList(source) {
  var list = $('#'+source+'-table');
  list.empty();
  list.hide();

  var heading = $('#'+source+'-heading');
  heading.hide();
}
