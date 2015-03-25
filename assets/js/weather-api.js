// request URL to get Sao Paulo weather information by the city id (3448439).
var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?id=3448439";

// object storing the weather information.
var weatherInfo = jQuery.parseJSON(
  jQuery.ajax({
    url: weatherUrl, 
    async: false,
    dataType: 'json'
  }).responseText
);

console.log(weatherInfo);
console.log("Icon: " + weatherInfo.weather[0].icon);

// convert the temperature from Kelvin to Celsius
var tempMaxCelsius = weatherInfo.main.temp_max - 273.15;
var tempMinCelsius = weatherInfo.main.temp_min - 273.15;

document.getElementById("temp").innerHTML = "Temperatura:<br /><br /> MÁX: "+ tempMaxCelsius.toFixed(0)+"<br /> MIN: "
	+ tempMinCelsius.toFixed(0);