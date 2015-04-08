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

function getWeatherData() {
  // request URL to get Sao Paulo weather information by the city id (3448439).
  var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?id=3448439";

  // object storing the weather information.
  var weatherInfo = $.parseJSON(
    $.ajax({
    url: weatherUrl, 
    async: false,
    dataType: 'json'
    }).responseText
  );

  console.log(weatherInfo);
  console.log("Icon: " + weatherInfo.weather[0].icon);

  return weatherInfo;
}

function displayTemperature(weatherInfo){
  // convert the temperature from Kelvin to Celsius
  var tempMaxCelsius = weatherInfo.main.temp_max - 273.15;
  var tempMinCelsius = weatherInfo.main.temp_min - 273.15;

  $("#temp").html("Temperatura:<br /><br /> MÁX: "+ tempMaxCelsius.toFixed(0)+"<br /> MIN: "
    + tempMinCelsius.toFixed(0));
}