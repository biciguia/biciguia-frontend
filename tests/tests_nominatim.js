/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

QUnit.module("nominatim");

var addressIME = [{
  "place_id":"90628654",
  "licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright",
  "osm_type":"way",
  "osm_id":"154079142",
  "boundingbox":["-23.5597475","-23.5588694","-46.7324821","-46.7317444"],
  "lat":"-23.55928935",
  "lon":"-46.732081060281",
  "display_name":"Bloco B, 1010, Rua do Matão, Butantã, São Paulo, Microrregião de São Paulo, RMSP, Mesorregião Metropolitana de São Paulo, São Paulo, Região Sudeste, 05508-090, Brasil",
  "class":"building",
  "type":"yes",
  "importance":0.711,
  "address":{
    "building":"Bloco B",
    "house_number":"1010",
    "road":"Rua do Matão",
    "suburb":"Butantã",
    "city_district":"Butantã",
    "city":"São Paulo",
    "county":"Microrregião de São Paulo",
    "state_district":"Mesorregião Metropolitana de São Paulo",
    "state":"São Paulo",
    "postcode":"05508-090",
    "country":"Brasil",
    "country_code":"br"
  },
}];

QUnit.test("getGeocoderURLFromAddress", function (assert) {
  var result = getGeocoderURLFromAddress("Rua do Matao, 1010");
  var expected = 'http://nominatim.openstreetmap.org/search?format=json&city=S%C3%A3o%20Paulo&state=S%C3%A3o%20Paulo&country=Brasil&street=Rua%20do%20Matao%2C%201010&viewbox=-47.357,-23.125,-45.863,-24.317&bounded=1&addressdetails=1'

  assert.equal(result, expected, "URL returned is ok");

  assert.ok(getGeocoderURLFromAddress("    ") == undefined, "Spaces are handled correctly");
});

QUnit.test("getAddressListHTML", function (assert) {
  var expected = "<li class='pure-menu-item'><a href='#' id='origin-0' class='pure-menu-link origin-suggestion-item'>Rua do Matão, 1010, Butantã</a></li>";

  var result = getAddressListHTML(addressIME, 'origin');

  assert.equal(result.length, 1, "Result has expected length");

  assert.equal(result[0], expected, "Result has expected item html");
});

QUnit.test("setMarker", function (assert) {
  var test_stubs = {
    "val":    sinon.spy(),
    "empty":  sinon.spy(),
    "hide":   sinon.spy(),
  };

  var marker_stub = {
    "addTo": sinon.spy()
  };

  var map_stub = {
    "setView": sinon.spy(),
    "fitBounds": sinon.spy()
  };

  mixpanel = {
    "track": sinon.spy()
  };

  $ = sinon.stub().returns(test_stubs);

  var old_removeRoute = removeRoute;

  removeRoute = sinon.spy();

  var old_L = L;
  L = sinon.stub(old_L);
  L.Marker.returns(marker_stub);

  map = map_stub;

  var test_event = {"target": {"id": "origin-0"}};

  addressSelected(test_event, addressIME);

  assert.ok($.calledWith("#origin-address"), "#origin-address reached correctly");
  assert.ok(test_stubs.val.calledWith(addressIME[0].display_name), "Address textbox changed correctly");
  assert.ok(L.Marker.calledWith([addressIME[0].lat, addressIME[0].lon]), "Marker created in the right place");
  assert.ok(marker_stub.addTo.calledWith(map_stub), "Marker added to map");
  assert.ok(map_stub.setView.calledWith([addressIME[0].lat, addressIME[0].lon], 17), "Map centered arround maker");
  assert.ok(removeRoute.calledOnce, "Removed route from map");
  assert.ok(mixpanel.track.calledOnce, "Mixpanel is called");

  removeRoute = old_removeRoute;
  L = old_L;
});
