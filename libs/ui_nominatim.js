/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

// globals used by the UI code
var madeRequest = false;
var lastKeypressId = 0;
var markers = [undefined, undefined];
var origin = undefined, destination = undefined;
var originConfigured = false;


function hideAddressListOnClick() {
  document.getElementById( "menu" ).onclick = function(){
    hideAddressList("origin");
    hideAddressList("destination");
  }
}

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
function onDOMReady() {
  hideAddressListOnClick();

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

  $("#broken-route-confirm-button").click(function(){
    var text = $("#text-broken-route").val();
    var brokenRouteObject = createBrokenRouteObject(text, origin.display_name, destination.display_name, markers[0], markers[1], polyline);
    var url = 'http://104.131.18.160:8000/reclamacao';
    $.post(url, brokenRouteObject, succesfulRequestBrokenRoute());
  });

  $(".address").focusout(showGeocodesAfterEvent);
  $(".address").keyup(keyUpHandler);

  $("#broken-route-button").click(function() {
    brokenRoute();
   });

  $('#botao-menu').click(function() {
  //We must have two functionalities here, one for big screens, other for small ones
    if($(window).width() <= 992) {
      $('#menu').animate({width: 'toggle'});
      $('#map').toggle();
      map.invalidateSize(); //So the tile maps load
    }
    else {
      $('#menu').animate({width: 'toggle'});
      map.invalidateSize(); //So the tile maps load
    }
  });


}

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

function succesfulRequestBrokenRoute(){
  $("#text-broken-route").hide();
  $("#text-broken-route").val('');
  $("#broken-route-confirm-button").hide();
  $("#broken-route-button").show();

  alert("Sua reclamação foi enviada! Obrigado pelo feedback!");
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

function setMarker(source, address, zoomIn) {
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

function menuItemSelected(event, addressesList) {
  var pieces = event.target.id.split('-');
  var source = pieces[0];
  var i = parseInt(pieces[1]);
  var coords = [addressesList[i].lat, addressesList[i].lon];
  setMarker(source,addressesList[i], true);
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

