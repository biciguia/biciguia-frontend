/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function getGeocoderURLFromAddress(address) {
  if (address.match('^ *$')) {
    return undefined;
  }

  var geoCoderURL = "https://nominatim.openstreetmap.org/search?format=json";
  geoCoderURL += "&city=" + encodeURIComponent("São Paulo");
  geoCoderURL += "&state=" + encodeURIComponent("São Paulo");
  geoCoderURL += "&country=Brasil";
  geoCoderURL += "&street=" + encodeURIComponent(address);
  geoCoderURL += "&viewbox=-47.357,-23.125,-45.863,-24.317&bounded=1";
  geoCoderURL += "&addressdetails=1";

  return geoCoderURL;
}

// REFACTOR: maybe change name and move to another file?
function getAddressListHTML(addresses, source) {
  var list = [];

  for (var i = 0; i < addresses.length; i++) {
    var road_name = addresses[i].address.road;
    if (addresses[i].address.house_number != undefined) {
      road_name += ", " + addresses[i].address.house_number;
    }
    if (addresses[i].address.city_district != undefined) {
      road_name += ", " + addresses[i].address.city_district;
    }
    addresses[i].display_name = road_name;
    var itemHtml = "<li class='pure-menu-item'>";
    itemHtml += "<a href='#' id='"+source+"-"+i+"' class='pure-menu-link "+source+"-suggestion-item'>";
    itemHtml += road_name+"</a></li>";

    list.push(itemHtml);
  }

  return list;
}
