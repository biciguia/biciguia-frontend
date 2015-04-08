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

  var expectedURL = "http://api.openweathermap.org/data/2.5/weather?id=3448439";

  assert.ok($.get.calledWith(expectedURL, 'dummy'), "$.get called correctly");
});

QUnit.test("displayTemperature", function (assert) {
  var weatherInfo = {
    "main": {
      "temp_max": 273.15 + 10,
      "temp_min": 273.15 + 5
    }
  };

  var test_stubs = {
    "html": sinon.spy()
  };

  $ = sinon.stub().returns(test_stubs);

  displayTemperature(weatherInfo);

  assert.ok($.calledWith("#temp"), "#temp accessed correctly");

  var expected = "Temperatura:<br /><br /> MÁX: 10<br /> MIN: 5";

  assert.ok(test_stubs.html.calledWith(expected), "Temperature rendered correctly");

});
