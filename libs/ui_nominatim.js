// globals used by the UI code
var madeRequest = false;
var lastKeypressId = 0;

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
  var geoCoderURL = getGeocoderURLFromAddress(address, source);

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
  L.marker(coords).addTo(map);
  map.setView(coords);
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

