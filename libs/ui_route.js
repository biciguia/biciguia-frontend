/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

// globals
var searchRoute = false;
var elev = false;
var routeLine = false;

$(document).ready(registerRouteCallbacks);
function registerRouteCallbacks() {
  $("#route-button").click(routeButton);

  $("#broken-route-button").click(showBrokenRouteFields);
  $("#broken-route-confirm-button").click(submitBrokenRoute);
}

function routeButton() {
  if(markers[0] != undefined && markers[1] != undefined) {
    getAndShowRoute();
  } else if (origin != undefined && destination != undefined) {
    if (markers[0] == undefined) {
      setMarker("origin",origin);
    }
    if (markers[1] == undefined) {
      setMarker("destination",destination);
    }
    getAndShowRoute();
  } else {
    if (markers[0] == undefined && origin == undefined) {
      if (markers[1] == undefined && destination == undefined) {
        alert("Favor escolher origem e destino válidos.");
      } else {
        alert("Favor escolher uma origem válida.");
      }
    } else if (markers[1] == undefined && destination == undefined) {
      alert("Favor escolher um destino válido.");
    }
  }
}

function getAndShowRoute() {
  searchRoute = true;
  var routeOptions = {
    option1: $('#option-1').is(':checked'),
    option2: $('#option-2').is(':checked'),
    option3: $('#option-3').is(':checked')
  };
  var requestURL = getRouterURL(markers[0]._latlng, markers[1]._latlng, routeOptions);

  $.get(requestURL, showRoute).fail(errorCallback);
}

function showRoute(response) {
  var decodedResponse = decodeRouterResponse(response);

  removeRoute();

  $('#weather').hide();
  $('#broken-route').show();

  var instructions = response.paths[0].instructions;
  $('#instructions').append('<p id="instructions-title">Instruções</p>');

  for(var i = 0; i < instructions.length; i++) {
    var html = generateInstructionHTML(i + 1, instructions[i]);

    $('#instructions').append(html);
  }

  addRouteToMap(decodedResponse);
}

function addRouteToMap(decodedResponse) {
  elev = L.control.elevation({
      position: "bottomleft",
      theme: "steelblue-theme", //default: lime-theme
      width: 600,
      height: 125,
      margins: {
          top: 10,
          right: 20,
          bottom: 30,
          left: 20
      },
      useHeightIndicator: true, //if false a marker is drawn at map position
      interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
      hoverNumber: {
          decimalsX: 0, //decimals on distance (always in km)
          decimalsY: 0, //deciamls on height (always in m)
          formatter: undefined //custom formatter function may be injected
      },
      xTicks: undefined, //number of ticks in x axis, calculated by default according to width
      yTicks: undefined, //number of ticks on y axis, calculated by default according to height
      collapsed: false    //collapsed mode, show chart on click or mouseover
  });

  // Adding elevation to map...
  elev.addTo(map);

  // The elevation library accepts only geojson, so let's give the library what it wants
  var responseAsGeojson = {
    "name": "FancyRoute",
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": decodedResponse,
        },
        "properties": null
      }
    ]
  };
  
  // Now let's add the route with elevation to the map. The elevation plugin does wonders
  routeLine = L.geoJson(responseAsGeojson, {onEachFeature: elev.addData.bind(elev)}).addTo(map);
  map.fitBounds(routeLine.getBounds());
}

function removeRoute() {
  if (routeLine) {
    if (map.hasLayer(routeLine)) {
      map.removeLayer(routeLine);
      routeLine = undefined;
    }
  }
  if (elev) {
     if (elev._map !== null) { // check if map has elevation enabled (leaflet doesn't have an api for this)
      elev.clear();
      map.removeControl(elev);
    }
  }

  $('#instructions').empty();
  $('#broken-route').hide();

  successfulRequestBrokenRoute(true);
  $('#weather').show();
}

function submitBrokenRoute() {
  var text = $("#text-broken-route").val();
  var brokenRouteObject = createBrokenRouteObject(text, origin.display_name, destination.display_name, markers[0], markers[1], routeLine);
  var url = 'http://104.131.18.160:8000/reclamacao';
  $.post(url, brokenRouteObject, successfulRequestBrokenRoute());
}

function showBrokenRouteFields() {
  if(!searchRoute) {
    alert("Você precisa escolher uma rota antes!");
  } else {
    $("#text-broken-route").show();
    $("#broken-route-confirm-button").show();
    $("#broken-route-button").hide();
  }
}

function successfulRequestBrokenRoute(hideAlert) {
  $("#text-broken-route").hide();
  $("#text-broken-route").val('');
  $("#broken-route-confirm-button").hide();
  $("#broken-route-button").show();

  if (hideAlert == undefined) {
    alert("Sua reclamação foi enviada! Obrigado pelo feedback!");
  }
}
