
var map;
function initializeMap(){
  map = L.map('map').setView([-23.5475, -46.63611], 13);
  // add an OpenStreetMap tile layer
  L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

}


// utility functions
function errorCallback() {
  console.log("ERROR");
}

// receives a function f and an argument s
// and returns a function that takes an argument d
// that runs f(d, s)
function bind2ndArgument(callback, source) {
  return function(data) { callback(data, source);};
}
//

function getGeocoderURLFromAddress(address, source) {
  if (address.match('^ *$')) {
    return undefined;
  }

  var geoCoderURL = "//nominatim.openstreetmap.org/search?format=json";
  geoCoderURL += "&city=" + encodeURIComponent("São Paulo");
  geoCoderURL += "&state=" + encodeURIComponent("São Paulo");
  geoCoderURL += "&country=Brasil";
  geoCoderURL += "&street=" + encodeURIComponent(address);

  return geoCoderURL;
}

function getAddressListHTML(addresses, source) {
  var list = [];

  for (var i = 0; i < addresses.length; i++) {
    var display_name = addresses[i].display_name;
    var itemHtml = "<li class='pure-menu-item'>";
    itemHtml += "<a href='#' id='"+source+"-"+i+"' class='pure-menu-link "+source+"-suggestion-item'>";
    itemHtml += display_name+"</a></li>";

    list.push(itemHtml);
  }

  return list;
}
