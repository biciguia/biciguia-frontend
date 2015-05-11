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

var addressIME = [{
  "place_id":"2582920987",
  "licence":"Data © OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
  "osm_type":"way",
  "osm_id":"154079145",
  "boundingbox":["-23.560148","-23.5581257","-46.7327102","-46.7306589"],
  "lat":"-23.55926325",
  "lon":"-46.7317498316745",
  "display_name":"Instituto de Matemática e Estatística, 1010, Rua do Matão, Butantã, São Paulo, Microrregião de São Paulo, RMSP, Mesorregião Metropolitana de São Paulo, São Paulo, Região Sudeste, 05508-090, Brasil",
  "class":"building",
  "type":"yes",
  "importance":0.511
}];

/* globals for mocking */
var $;

QUnit.test("getGeocoderURLFromAddress", function (assert) {
  var result = getGeocoderURLFromAddress("Rua do Matao, 1010");
  var expected = 'http://nominatim.openstreetmap.org/search?format=json&city=S%C3%A3o%20Paulo&state=S%C3%A3o%20Paulo&country=Brasil&street=Rua%20do%20Matao%2C%201010';

  assert.equal(result, expected, "URL returned is ok");

  assert.ok(getGeocoderURLFromAddress("    ") == undefined, "Spaces are handled correctly");
});

QUnit.test("bind2ndArgument", function (assert) {
  var callback = sinon.spy();

  var newFn = bind2ndArgument(callback, 'origin');

  newFn('test');
  assert.ok(callback.calledWith('test', 'origin'), "Arguments are passed correctly");

  newFn('test2');
  assert.ok(callback.calledWith('test2', 'origin'), "The function doesn't register incorrect arguments");

  assert.notEqual(callback.calledWith('test', 'destination'), true, "The bound argument is passed correctly");
});

QUnit.test("getAddressListHTML", function (assert) {
  var expected = "<li class='pure-menu-item'><a href='#' id='origin-0' class='pure-menu-link origin-suggestion-item'>Instituto de Matemática e Estatística, 1010, Rua do Matão, Butantã, São Paulo, Microrregião de São Paulo, RMSP, Mesorregião Metropolitana de São Paulo, São Paulo, Região Sudeste, 05508-090, Brasil</a></li>";

  var result = getAddressListHTML(addressIME, 'origin');

  assert.equal(result.length, 1, "Result has expected length");

  assert.equal(result[0], expected, "Result has expected item html");
});

QUnit.test("hideAddressList", function (assert) {
  var test_stubs = {
    "empty": sinon.spy(),
    "hide":  sinon.spy()
  };

  $ = sinon.stub().returns(test_stubs);

  spinner = {
    "stop": sinon.spy()
  };

  hideAddressList('origin');

  assert.ok($.calledWith('#origin-table'), "#origin-table reached correctly");

  assert.ok(test_stubs.empty.calledOnce, "The list is emptied");
  assert.ok(test_stubs.hide.calledOnce, "The elements are hidden");

  assert.ok(spinner.stop.calledOnce, "The spinner was stopped");
});

QUnit.test("showAddressList", function (assert) {
  var test_stubs = {
    "empty":  sinon.spy(),
    "show":   sinon.spy(),
    "append": sinon.spy(),
    "click":  sinon.spy()
  };

  $ = sinon.stub().returns(test_stubs);
  
  showAddressList(addressIME, 'origin');

  assert.ok($.calledWith("#origin-table"), "#origin-table reached correctly");
  assert.ok($.calledWith("#origin-heading"), "#origin-heading reached correctly");
  assert.ok($.calledWith(".origin-suggestion-item"), ".origin-suggestion-item reached correctly");

  assert.ok(test_stubs.empty.calledOnce, "The list is emptied");
  assert.ok(test_stubs.show.calledTwice, "The elements are shown");
  assert.ok(test_stubs.append.calledOnce, "The elements are added to the list");
  assert.ok(test_stubs.click.calledOnce, "The click handlers are changed");
});

QUnit.test("menuItemSelected", function (assert) {
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
  $ = sinon.stub().returns(test_stubs);

  var old_L = L;
  L = sinon.stub(old_L);
  L.Marker.returns(marker_stub);

  map = map_stub;

  var test_event = {"target": {"id": "origin-0"}};

  menuItemSelected(test_event, addressIME);

  assert.ok($.calledWith("#origin-address"), "#origin-address reached correctly");
  assert.ok(test_stubs.val.calledWith(addressIME[0].display_name), "Address textbox changed correctly");
  assert.ok(L.Marker.calledWith([addressIME[0].lat, addressIME[0].lon]), "Marker created in the right place");
  assert.ok(marker_stub.addTo.calledWith(map_stub), "Marker added to map");
  assert.ok(map_stub.setView.calledWith([addressIME[0].lat, addressIME[0].lon], 17), "Map centered arround maker");

  L = old_L;
});
