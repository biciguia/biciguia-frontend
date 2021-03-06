/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

$(document).ready(registerAddressCallbacks);
function registerAddressCallbacks() {
  $(".address").focusin(addressFocusIn);
  $(".address").blur(addressFocusOut);
  $(".address").keyup(keyUpHandler);
}

function addressFocusIn(event) {
  showGeocodesAfterEvent(event);
}

function addressFocusOut(event) {
  var source = event.target.id.split('-')[0];
  hideAddressList(source);
}

//TODO: change name
function showGeocodesAfterEvent(event) {
  var value = $(event.target).val();
  spinner.spin(document.getElementById("spinner"));
  if (event.target.id == 'origin-address') {
    getAndShowGeocodes(value, 'origin');
  } else {
    getAndShowGeocodes(value, 'destination');
  }
}

function latLonInput(target) {
  var source = target.id.split('-')[0];
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
    spinner.stop();
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

  mixpanel.track("addressSelected-"+source);
}

function getSelectedAddressElement() {
  return $(document.activeElement)[0].id.split('-')[0];
}

function showAddressList(addresses, source) {
  // if user writes something and exits the edit box, do not show the address list
  var activeElement = getSelectedAddressElement();
  if (source != activeElement) {
    spinner.stop();
    return;
  }

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

  $('.'+source+'-suggestion-item').on("mousedown", bind2ndArgument(addressSelected, addresses));
}

function hideAddressList(source) {
  var list = $('#'+source+'-table');
  list.hide();
}
