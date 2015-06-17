/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

function getRouterURL(originLatLng, destinationLatLng, routeOptions) {
  var requestURL = "http://104.131.18.160:8989/route?point=";
  requestURL += encodeURIComponent(originLatLng.lat+","+originLatLng.lng);
  requestURL += "&point=";
  requestURL += encodeURIComponent(destinationLatLng.lat+","+destinationLatLng.lng);
  requestURL += "&locale=pt_BR&instructions=true&vehicle=bike2&elevation=true";

  // TODO send along options to the router

  return requestURL;
}

function decodeRouterResponse(encodedResponse) {
  var result = decodePath(encodedResponse.paths[0].points, true);
  return result;
}

function convertTimeUnit(ms) {
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

function generateInstructionHTML(id, instruction) {
  var distancia = instruction.distance;

  var result = '<div class="instruction">'+
                  '<p class="instruction-text">'+id+'. '+instruction.text+'</p>'+
                  '<div class="instruction-info">'+
                    '<div class="intruction-time">'+convertTimeUnit(instruction.time)+'</div>';

  if(distancia >= 1000) {
    distancia /= 1000;
    result += '<div class="intruction-dist">'+distancia.toFixed(1)+' km</div>';
  } else {
    result += '<div class="intruction-dist">'+distancia.toFixed(0)+' m</div>';
  }
  
  result +=  '</div>'+
            '</div>';

  return result;
}

function createBrokenRouteObject(text, origin, destination, origin_point, destination_point, route) {
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
