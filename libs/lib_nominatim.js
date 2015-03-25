// setup event handlers only after the DOM is ready
//
//
//
//


function callBackWrapper(origin){
    return function(data) {callBack (data, origin);};
}


function getGeocodeFromAddress(element, origin) {
    var geoCoderURL = "//nominatim.openstreetmap.org/search?format=json";
    geoCoderURL += "&city=" + encodeURIComponent("São Paulo");
    geoCoderURL += "&state=" + encodeURIComponent("São Paulo");
    geoCoderURL += "&country=Brasil";
    geoCoderURL += "&street=" + encodeURIComponent($(element).val());
    $.get(geoCoderURL, callBackWrapper(origin)).fail(function(){
        console.log("ERRO");
    });

}


function callBack(data, origin){
    if (origin == 'origin') {
        showAddressList(data, $("#origin_table"));
    } else {
        showAddressList(data, $("#destination_table"));
    }
}
