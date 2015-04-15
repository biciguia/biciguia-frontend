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

/* globals for mocking */
var $;

QUnit.test("getWeatherData", function (assert) {
  $ = {
    "get": sinon.spy()
  };

  getWeatherData('dummy');

  var expectedURL = "http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&id=3448439&cnt=2";

  assert.ok($.get.calledWith(expectedURL, 'dummy'), "$.get called correctly");
});

QUnit.test("displayTemperature", function (assert) {
  var weatherInfo = {
    "list": [
    {
      "humidity": 50,
      "temp": {
        "max": 30,
        "min": 15
      },
      "weather": [{
        "icon": 'dummy1'
      }]
    },
    {
      "humidity": 80,
      "temp": {
        "max": 40,
        "min": 25
      },
      "weather": [{
        "icon": 'dummy2'
      }]
    },
    ]
  };

  var test_stubs = {
    "html": sinon.spy()
  };

  $ = sinon.stub().returns(test_stubs);

  displayTemperature(weatherInfo);

  assert.ok($.calledWith("#weather"), "#weather accessed correctly");

  var expected = "Tempo<br><br><img src='http://openweathermap.org/img/w/dummy1.png'></img>" +
    "<br>Máx 30 °C<br>Min 15 °C<br>Umidade do ar 50%<br><br>" + 
    "Amanhã<br><img src='http://openweathermap.org/img/w/dummy2.png'></img>" +
    "<br>Máx 40 °C<br>Min 25 °C<br>Umidade do ar 80%<br>";

  assert.ok(test_stubs.html.calledWith(expected), "Temperature rendered correctly");

});
