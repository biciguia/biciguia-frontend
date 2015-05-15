/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

function displayTemperature(weatherInfo) {
  spinner.stop();

  var html = "Previsão do tempo<br>";

  for (var i = 0; i < 2; i++) {
    var info = weatherInfo.list[i];
    html += "<img src='" +
      'http://openweathermap.org/img/w/' + info.weather[0].icon + '.png' +
      "'></img><br>";
    html += "Máx " + info.temp.max + " °C<br>";
    html += "Min " + info.temp.min + " °C<br>";
    html += "Umidade do ar " + info.humidity + "%<br>";

    if (i == 0) {
      html += "<br>Amanhã<br>";
    }
  }

  $("#weather").html(html);
}
