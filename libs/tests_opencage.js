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

var addressIME = {
  "results": [
  {
    "annotations": {
      "DMS": {
        "lat": "23\u00b0 33' 33.66378'' S",
        "lng": "46\u00b0 43' 55.37842'' W"
      },
      "MGRS": "23KLP2321893489",
      "Maidenhead": "GG66pk25ds",
      "Mercator": {
        "x": -5202187.961,
        "y": -2682732.013
      },
      "OSM": {
        "url": "http:\/\/www.openstreetmap.org\/?mlat=-23.55935&mlon=-46.73205#map=17\/-23.55935\/-46.73205"
      },
      "callingcode": 55,
      "geohash": "6gycbx4ub6dhzdvuyf65",
      "sun": {
        "rise": {
          "astronomical": 1428912180,
          "civil": 1428915360,
          "nautical": 1428913800
        },
        "set": {
          "astronomical": 1428963060,
          "civil": 1428959880,
          "nautical": 1428961500
        }
      },
      "timezone": {
        "name": "America\/Sao_Paulo",
        "now_in_dst": 0,
        "offset_sec": -10800,
        "offset_string": -300,
        "short_name": "BRT"
      },
      "what3words": {
        "words": "supposed.nagging.topic"
      }
    },
    "bounds": {
      "northeast": {
        "lat": -23.5589311,
        "lng": -46.7317129
      },
      "southwest": {
        "lat": -23.5598092,
        "lng": -46.7324506
      }
    },
    "components": {
      "city": "S\u00e3o Paulo",
      "city_district": "Butant\u00e3",
      "country": "Brasil",
      "country_code": "br",
      "county": "RMSP",
      "house": "IME - Bloco B",
      "house_number": "1010",
      "road": "Rua do Mat\u00e3o",
      "state": "S\u00e3o Paulo",
      "suburb": "Butant\u00e3"
    },
    "confidence": 10,
    "formatted": "IME - Bloco B, 1010 Rua do Mat\u00e3o",
    "geometry": {
      "lat": -23.55935105,
      "lng": -46.732049560281
    }
  }
  ]};

/* globals for mocking */
var $; /* jquery */

QUnit.test("getGeocoderURLFromAddress", function (assert) {
  var result = getGeocoderURLFromAddress("Rua do Matao, 1010");
  var expected = 'https://api.opencagedata.com/geocode/v1/json?key=651ad55fe59eed0f1beb0c550ab6b0d3&countrycode=BR&language=pt-BR&min_confidence=3&fields=geometry%2Ccomponents&q=Rua%20do%20Matao%2C%201010%2C%20S%C3%A3o%20Paulo';

  assert.ok(result == expected, "URL returned is ok");

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
  var expected = "<li class='address-suggestion-item pure-menu-item'><a href='#' id='origin-0' class='address-suggestion-item pure-menu-link origin-suggestion-item'>IME - Bloco B, 1010 Rua do Mat\u00e3o</a></li>";

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

  spinner = {
    "stop": sinon.spy()
  };

  showAddressList(addressIME, 'origin');

  assert.ok($.calledWith("#origin-table"), "#origin-table reached correctly");
  assert.ok($.calledWith(".origin-suggestion-item"), ".origin-suggestion-item reached correctly");

  assert.ok(test_stubs.empty.calledOnce, "The list is emptied");
  assert.ok(test_stubs.show.calledOnce, "The elements are shown");
  assert.ok(test_stubs.append.calledOnce, "The elements are added to the list");
  assert.ok(test_stubs.click.calledOnce, "The click handlers are changed");

  assert.ok(spinner.stop.calledOnce, "The spinner was stopped");
});

QUnit.test("menuItemSelected", function (assert) {
  var test_stubs = {
    "val":    sinon.spy(),
    "empty":  sinon.spy(),
    "hide":   sinon.spy(),
  };

  var marker_stubs = {
    "addTo": sinon.spy()
  };

  var map_stub = {
    "setView": sinon.spy(),
    "fitBounds": sinon.spy(),
    "removeLayer": sinon.spy()
  };
  $ = sinon.stub().returns(test_stubs);

  var marker_stub = sinon.stub(L, "Marker");
  marker_stub.returns(marker_stubs);

  map = map_stub;

  var old_hideAddressList = hideAddressList;
  hideAddressList = sinon.spy();

  var test_event = {"target": {"id": "origin-0"}};

  menuItemSelected(test_event, addressIME);

  assert.ok($.calledWith("#origin-address"), "#origin-address reached correctly");
  assert.ok(test_stubs.val.calledWith(addressIME.results[0].formatted), "Address textbox changed correctly");
  assert.ok(L.Marker.calledWith([addressIME.results[0].geometry.lat, addressIME.results[0].geometry.lng]), "Marker created in the right place");
  assert.ok(marker_stubs.addTo.calledWith(map_stub), "Marker added to map");
  assert.ok(map_stub.setView.calledWith([addressIME.results[0].geometry.lat, addressIME.results[0].geometry.lng], 17), "Map centered arround maker");

  assert.ok(hideAddressList.calledOnce, "Address list was hidden");

  marker_stub.restore();
  hideAddressList = old_hideAddressList;
});

