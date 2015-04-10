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

function getWeatherData(callback) {
  // request URL to get Sao Paulo weather information by the city id (3448439).
  var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&id=3448439&cnt=2"

  $.get(weatherUrl, callback);
}
