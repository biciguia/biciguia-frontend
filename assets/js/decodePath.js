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

function decodePath(encoded, is3D) {
  // var start = new Date().getTime();
  var len = encoded.length;
  var index = 0;
  var array = [];
  var lat = 0;
  var lng = 0;
  var ele = 0;

  while (index < len) {
    var b;
    var shift = 0;
    var result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var deltaLon = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += deltaLon;

    if (is3D) {
      // elevation
      shift = 0;
      result = 0;
      do
      {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var deltaEle = ((result & 1) ? ~(result >> 1) : (result >> 1));
      ele += deltaEle;
      array.push([lng * 1e-5, lat * 1e-5, ele / 100]);
    } else
      array.push([lng * 1e-5, lat * 1e-5]);
  }
  // var end = new Date().getTime();
  // console.log("decoded " + len + " coordinates in " + ((end - start) / 1000) + "s");
  return array;
}
