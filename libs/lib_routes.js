/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

//var polyline;
var searchRoute = false;
var elev = false;
var routeLine = false;

function routeByCoordinates(originLatLng, destinationLatLng, routeOptions) {
  var requestURL = getRouteURLFromCoordinates(originLatLng, destinationLatLng, routeOptions);

  $.get(requestURL, displayRoute).fail(errorCallback);
}

function getRouteURLFromCoordinates (originLatLng, destinationLatLng, routeOptions)
{
  var requestURL = "http://104.131.18.160:8989/route?point=";
  requestURL += encodeURIComponent(originLatLng.lat+","+originLatLng.lng);
  requestURL += "&point=";
  requestURL += encodeURIComponent(destinationLatLng.lat+","+destinationLatLng.lng);
  requestURL += "&locale=pt_BR&instructions=true&vehicle=bike2&elevation=true";

  // TODO send along options to the router

  return requestURL;
}

function displayRoute(response) {
  var decodedResponse = decodeRouteResponse(response);

  removeRoute();

  $('#weather').hide();
  $('#broken-route').show();

  var instructions = response.paths[0].instructions;
  $('#instructions').append('<p id="instructions-title">Instruções</p>');

  for(var i = 0; i < instructions.length; i++){
    var html = instructionHtml(i + 1, instructions[i]);

    $('#instructions').append(html);
  }

  //polyline = L.polyline(decodedResponse, {color: 'red'}).addTo(map);
  _displayRouteWithElevation(decodedResponse);
  //map.fitBounds(polyline.getBounds());
}

function decodeRouteResponse(encodedResponse) {
  var result = decodePath(encodedResponse.paths[0].points, true);
  return result;
}

function removeRoute() {
  if (routeLine) {
    if (map.hasLayer(routeLine)) {
      map.removeLayer(routeLine);
      routeLine = undefined;
    }
  }
  if (elev) {
     if (elev._map !== null) { // Código para sacar se a elevação está no mapa. O leaflet não dá API para isso
      elev.clear();
      map.removeControl(elev);
    }
  }

  $('#instructions').empty();
  $('#broken-route').hide();
  successfulRequestBrokenRoute(true);
  $('#weather').show();
}

function convertTimeUnit(ms){
  var segundos = ms/1000;
  var minutos = segundos/60;
  var horas = minutos/60;
  segundos = Math.floor(segundos);
  minutos = Math.floor(minutos);
  horas = Math.floor(horas);

  segundos -= minutos*60;
  minutos -= horas*60;
  
  if(segundos >= 30) {
    minutos++;
  }
  if (horas > 0) {
    return horas+' h'+minutos+' min';
  } else {
    return minutos+' min';
  } 
}

function instructionHtml(id, instruction){
  var distancia = instruction.distance;

  var result = '<div class="instruction">'+
                  '<p class="instruction-text">'+id+'. '+instruction.text+'</p>'+
                  '<div class="instruction-info">'+
                    '<div class="intruction-time">'+convertTimeUnit(instruction.time)+'</div>';

  if(distancia >= 1000) {
    distancia /= 1000;
    result += '<div class="intruction-dist">'+distancia.toFixed(1)+' km</div>';
  }
  else {
    result += '<div class="intruction-dist">'+distancia.toFixed(0)+' m</div>';
  }
  
  result +=  '</div>'+
            '</div>';

  return result;
}

function createBrokenRouteObject(text, origin, destination, origin_point, destination_point, route){
  var result = {
    "texto": text,
    "endereco_origem": origin,
    "endereco_destino": destination,
    "ponto_origem": origin_point.toGeoJSON(),
    "ponto_destino": destination_point.toGeoJSON(),
    "rota_tracada": route.toGeoJSON(),
  };

  return result;
}

function _displayRouteWithElevation(decodedResponse) {
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
  
  // Now let's add the route with elevation to the map. The elevation plugin does wonders w
  routeLine = L.geoJson(responseAsGeojson, {onEachFeature: elev.addData.bind(elev)}).addTo(map);
  map.fitBounds(routeLine.getBounds(routeLine));
}
