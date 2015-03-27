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

