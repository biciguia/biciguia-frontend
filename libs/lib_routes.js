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

function routeByCoordinates(originLatLng, destinationLatLng, routeOptions) {
  var requestURL = getRouteURLFromCoordinates(originLatLng, destinationLatLng, routeOptions);

  $.get(requestURL, displayRoute).fail(errorCallback);
}

function getRouteURLFromCoordinates (originLatLng, destinationLatLng, routeOptions)
{
  var requestURL = "http://104.131.18.160:5000/viaroute?loc=";
  requestURL += originLatLng.lat + ",";
  requestURL += originLatLng.lng + "&loc=";
  requestURL += destinationLatLng.lat + ",";
  requestURL += destinationLatLng.lng + "&instructions=true";

  // TODO send along options to the router
  console.log(routeOptions);

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
  return OSRM.RoutingGeometry._decode(encodedResponse.route_geometry, OSRM.CONSTANTS.PRECISION);
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
  return ms+' ms';
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