/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

function getWeatherData(callback) {
  spinner.spin(document.getElementById("spinner"));
  // request URL to get Sao Paulo weather information by the city id (3448439).
  var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&id=3448439&cnt=2";

  $.get(weatherUrl, callback);
}
