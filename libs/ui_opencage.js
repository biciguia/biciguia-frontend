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
      spinner.spin(document.getElementById("spinner"));
      showGeocodesAfterEvent(event);
    }
    // TODO adjust the timeout below
  }, 100);
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
  var coords = [addressesList.results[i].geometry.lat,
                addressesList.results[i].geometry.lng];
  var zoom = 17;
  $('#'+source+'-address').val(addressesList.results[i].formatted);
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
  }else{
    map.setView(coords, zoom);
  }

}

function showAddressList(addresses, source) {
  spinner.stop();

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
  spinner.stop();

  var list = $('#'+source+'-table');
  list.empty();
  list.hide();

  var heading = $('#'+source+'-heading');
  heading.hide();
}
