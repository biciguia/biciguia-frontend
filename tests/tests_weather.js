/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

QUnit.module("weather");

QUnit.test("getWeatherData", function (assert) {
  $ = {
    "get": sinon.spy()
  };

  spinner = {
    "spin": sinon.spy()
  };

  getWeatherData('dummy');

  var expectedURL = "http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&id=3448439&cnt=2";

  assert.ok($.get.calledWith(expectedURL, 'dummy'), "$.get called correctly");

  assert.ok(spinner.spin.calledOnce, "Spinner was started");
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

  spinner = {
    "stop": sinon.spy()
  };

  displayTemperature(weatherInfo);

  assert.ok($.calledWith("#weather"), "#weather accessed correctly");

  var expected = "Previsão do tempo<br><img src='http://openweathermap.org/img/w/dummy1.png'></img>" +
    "<br>Máx 30 °C<br>Min 15 °C<br>Umidade do ar 50%<br><br>" + 
    "Amanhã<br><img src='http://openweathermap.org/img/w/dummy2.png'></img>" +
    "<br>Máx 40 °C<br>Min 25 °C<br>Umidade do ar 80%<br>";

  assert.ok(test_stubs.html.calledWith(expected), "Temperature rendered correctly");

  assert.ok(spinner.stop.calledOnce, "The spinner was stopped");
});
