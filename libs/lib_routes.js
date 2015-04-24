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

function routeByCoordinates(originLatLng, destinationLatLng) {
  makeRouteRequest(originLatLng, destinationLatLng);
}

function makeRouteRequest(originLatLng, destinationLatLng) {
  var requestURL = getRouteURLFromCoordinates(originLatLng, destinationLatLng)

  console.log(requestURL);
  $.get(requestURL, displayRoute).fail(errorCallback);
}

function getRouteURLFromCoordinates (originLatLng, destinationLatLng)
{
  var requestURL = "http://104.131.18.160:5000/viaroute?loc=";
  requestURL += originLatLng.lat + ",";
  requestURL += originLatLng.lng + "&loc=";
  requestURL += destinationLatLng.lat + ",";
  requestURL += destinationLatLng.lng + "&instructions=true";

  return requestURL;
}

function displayRoute(response) {
  var decodedResponse = decodeRouteResponse(response);
  
  polyline = L.polyline(decodedResponse, {color: 'red'}).addTo(map);
  map.fitBounds(polyline.getBounds());
}

function decodeRouteResponse(encodedResponse) {
  return OSRM.RoutingGeometry._decode(encodedResponse.route_geometry, OSRM.CONSTANTS.PRECISION);
}

function hideRoute() {
  if(polyline != undefined) {
    map.removeLayer(polyline);
    polyline = undefined;
  }
}