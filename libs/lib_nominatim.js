//
//
//
//

function errorCallback() {
  console.log("ERROR");
}

function getGeocodeFromAddress(element, source) {
  var value = $(element).val();
  if (value.match('/^\s*$/')) {
    /* hideAddressList(source); */
    return;
  }
  var geoCoderURL = "//nominatim.openstreetmap.org/search?format=json";
  geoCoderURL += "&city=" + encodeURIComponent("São Paulo");
  geoCoderURL += "&state=" + encodeURIComponent("São Paulo");
  geoCoderURL += "&country=Brasil";
  geoCoderURL += "&street=" + encodeURIComponent(value);
  $.get(geoCoderURL, bind2ndArgument(showAddressList, source)).fail(errorCallback);
}

// receives a function f and an argument s
// and returns a function that takes an argument d
// that runs f(d, s)
function bind2ndArgument(callback, source){
  return function(data) { callback(data, source);};
}

function menuItemSelected(event, addressesList) {
  var pieces = event.target.id.split('-');
  var source = pieces[0];
  var i = parseInt(pieces[1]);
  $('#'+source+'_address').val(addressesList[i].display_name);
  hideAddressList(source);
}

function showAddressList(addresses, source) {
  var list = $('#'+source+'_table');
  list.empty();
  list.show();
  var heading = $('#'+source+'_heading');
  heading.show();

  for (var i = 0; i < addresses.length; i++) {
    var display_name = addresses[i].display_name;
    var itemHtml = "<li class='pure-menu-item'><a href='#' id='"+source+"-"+i+"' class='pure-menu-link suggestion_item'>"+display_name+"</a></li>";
    list.append(itemHtml);

    // TODO for each address, place a marker in the map
  }

  $('.suggestion_item').click(bind2ndArgument(menuItemSelected, addresses));
}

function hideAddressList(source) {
  var list = $('#'+source+'_table');
  list.empty();
  list.hide();

  var heading = $('#'+source+'_heading');
  heading.hide();
}
