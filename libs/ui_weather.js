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

function displayTemperature(weatherInfo){
	var html = "Tempo<br><br>";

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
