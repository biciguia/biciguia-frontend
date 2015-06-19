/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

$(document).ready(registerAddressCallbacks);
function registerAddressCallbacks() {
  $("#menu").click(function(){
    hideAddressList("origin");
    hideAddressList("destination");
  })

  $(".address").focusout(showGeocodesAfterEvent);
  $(".address").keyup(keyUpHandler);
}

//TODO: change name
function showGeocodesAfterEvent(event) {
  var value = $(event.target).val();
  if (!madeRequest) {
    madeRequest = true;
    if (event.target.id == 'origin-address') {
      getAndShowGeocodes(value, 'origin');
    } else {
      getAndShowGeocodes(value, 'destination');
    }
  }
}

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

function getAndShowGeocodes(address, source) {
  var geoCoderURL = getGeocoderURLFromAddress(address);

  if (geoCoderURL == undefined) {
    hideAddressList(source);
  } else {
    $.get(geoCoderURL, bind2ndArgument(showAddressList, source)).fail(errorCallback);
  }
}

function addressSelected(event, addressesList) {
  var pieces = event.target.id.split('-');
  var source = pieces[0];
  var i = parseInt(pieces[1]);
  var coords = [addressesList[i].lat, addressesList[i].lon];
  setMarker(source,addressesList[i], true);
}

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

  $('.'+source+'-suggestion-item').click(bind2ndArgument(addressSelected, addresses));
}

function hideAddressList(source) {
  spinner.stop();

  var list = $('#'+source+'-table');
  list.empty();
  list.hide();
}
