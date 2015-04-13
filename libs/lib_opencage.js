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

var map;
function initializeMap(){
  map = L.map('map').setView([-23.5475, -46.63611], 13);
  // add an OpenStreetMap tile layer
  L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

}


// utility functions
function errorCallback() {
  console.log("ERROR");
}

// receives a function f and an argument s
// and returns a function that takes an argument d
// that runs f(d, s)
function bind2ndArgument(callback, source) {
  return function(data) { callback(data, source);};
}
//

function getGeocoderURLFromAddress(address) {
  if (address.match('^ *$')) {
    return undefined;
  }

  var api_key = '651ad55fe59eed0f1beb0c550ab6b0d3';

  address += ", São Paulo";

  var geoCoderURL = "https://api.opencagedata.com/geocode/v1/json?key=" + encodeURIComponent(api_key);
  geoCoderURL += "&countrycode=BR";
  geoCoderURL += "&language=pt-BR";
  geoCoderURL += "&min_confidence=3";
  geoCoderURL += "&fields=" + encodeURIComponent("geometry,components");
  geoCoderURL += "&q=" + encodeURIComponent(address);

  return geoCoderURL;
}

function getAddressListHTML(addresses, source) {
  var list = [];

  for (var i = 0; i < addresses.results.length; i++) {
    var display_name = addresses.results[i].formatted;
    var itemHtml = "<li class='pure-menu-item'>";
    itemHtml += "<a href='#' id='"+source+"-"+i+"' class='pure-menu-link "+source+"-suggestion-item'>";
    itemHtml += display_name+"</a></li>";

    list.push(itemHtml);
  }

  return list;
}
