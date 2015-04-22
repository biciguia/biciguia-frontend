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

function routeByCoordinates(originLatLng, destinationLatLng) {
  makeRouteRequest(originLatLng, destinationLatLng);
}

function makeRouteRequest(originLatLng, destinationLatLng) {
  var requestURL = getRouteURLFromCoordinates(originLatLng, destinationLatLng)

  console.log(requestURL);
  $.get(requestURL, displayRoute).fail(errorCallback);

  // mock displayRoute
  // var obj = {"hint_data":{"locations":["NQsFAJ4wCABcAQAAmwAAAEQAAACTAAAAPQEAAP81AwAAAAAAxIKY_sfuNv0BACIA","CMkBALvYBQA2bgAAwQAAAIIAAAAAAAAAjgAAAPpkAgAAAAAAkIOY_u_3Nv0AACEA"],"checksum":2196113668},"route_name":["{highway:steps}","Avenida Professor Luciano Gualberto"],"via_indices":[0,14],"found_alternative":false,"route_summary":{"end_point":"Avenida Professor Luciano Gualberto","start_point":"{highway:footway}","total_time":192,"total_distance":323},"via_points":[[-23.559484,-46.731575],[-23.55928,-46.729233]],"route_instructions":[["10","{highway:footway}",50,0,68,"50m","N",17,2],["1","{highway:steps}",54,2,99,"54m","NE",25,2],["2","Avenida Professor Luciano Gualberto",43,5,13,"43m","SE",118,1],["8","{highway:tertiary_link}",31,6,14,"30m","E",83,1],["4","Avenida Professor Luciano Gualberto",144,9,20,"144m","SE",114,2],["15","",0,13,0,"0m","N",0]],"route_geometry":"vr}|k@prgcxA{LqC{KkDcIkDeEkEmDcIjJoV_@oGuC_BaCB`DwKr@gCnLm`@|Lk\\","status_message":"Found route between points","status":0};
  // displayRoute(obj);

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
  console.log(response);
  var decodedResponse = decodeRouteResponse(response);
  console.log(decodedResponse);
  var polyline = L.polyline(decodedResponse, {color: 'red'}).addTo(map);

  map.fitBounds(polyline.getBounds());
}

function decodeRouteResponse(encodedResponse) {
  return OSRM.RoutingGeometry._decode(encodedResponse.route_geometry, OSRM.CONSTANTS.PRECISION);
}
