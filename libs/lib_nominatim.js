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

  var geoCoderURL = "http://nominatim.openstreetmap.org/search?format=json";
  geoCoderURL += "&city=" + encodeURIComponent("São Paulo");
  geoCoderURL += "&state=" + encodeURIComponent("São Paulo");
  geoCoderURL += "&country=Brasil";
  geoCoderURL += "&street=" + encodeURIComponent(address);

  return geoCoderURL;
}

function getAddressListHTML(addresses, source) {
  var list = [];

  for (var i = 0; i < addresses.length; i++) {
    var display_name = addresses[i].display_name;
    var itemHtml = "<li class='pure-menu-item'>";
    itemHtml += "<a href='#' id='"+source+"-"+i+"' class='pure-menu-link "+source+"-suggestion-item'>";
    itemHtml += display_name+"</a></li>";

    list.push(itemHtml);
  }

  return list;
}
