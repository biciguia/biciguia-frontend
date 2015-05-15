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

var polyline;
var searchRoute = false;

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

  var instructions = response.paths[0].instructions;
  $('#instructions').append('<p id="instructions-title">Instruções</p>');

  for(var i = 0; i < instructions.length; i++){
    var html = instructionHtml(i + 1, instructions[i]);

    $('#instructions').append(html);
  }

  polyline = L.polyline(decodedResponse, {color: 'red'}).addTo(map);
  map.fitBounds(polyline.getBounds());
}

function decodeRouteResponse(encodedResponse) {
  var result = decodePath(encodedResponse.paths[0].points, true);
  return invertLatLngs(result);
}

function invertLatLngs(array) {
  var result = array;
  for (var i = 0; i < result.length; i++) {
    var tmp = result[i][0];
    result[i][0] = result[i][1];
    result[i][1] = tmp;
  }
  return result;
}

function removeRoute() {
  if (polyline != undefined) {
    map.removeLayer(polyline);
    polyline = undefined;
  }

  $('#instructions').empty();
  
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
  if (horas > 0) {
    return horas+'h'+minutos+'m';
  } else if (minutos > 0) {
    return minutos+'m'+segundos+'s';
  } else {
    return segundos+'s';
  }
}

function instructionHtml(id, instruction){
  var result = '<div class="instruction">'+
                  '<p class="instruction-text">'+id+'. '+instruction.text+'</p>'+
                  '<div class="instruction-info">'+
                    '<div class="intruction-time">'+convertTimeUnit(instruction.time)+'</div>'+
                    '<div class="intruction-dist">'+instruction.distance+' m</div>'+
                  '</div>'+
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
