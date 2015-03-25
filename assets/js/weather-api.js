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
console.log(weatherInfo.weather[0]);
