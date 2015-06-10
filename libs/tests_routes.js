/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

/* globals for mocking */
var polyline;
var map;

QUnit.test("getRouteURLFromCoordinates ", function (assert) {
  var origin = {
    lat: 10,
    lng: -10
  };

  var destination = {
    lat: 20,
    lng: -20
  };

  var options = {
    option1: false,
    option2: true,
    option3: false,
  };

  var result = getRouteURLFromCoordinates(origin, destination, options);

  var expected = 'http://104.131.18.160:8989/route?point=10%2C-10&point=20%2C-20&locale=pt_BR&instructions=true&vehicle=bike2&elevation=true';

  assert.equal(result, expected, "Route URL was generated correctly");
});

QUnit.test("displayRoute", function (assert) {
  var decodedResponse = [[1, -1], [2, -2]];

  var old_decodeRouteResponse = decodeRouteResponse;
  decodeRouteResponse = sinon.stub().returns(decodedResponse);

  var old_removeRoute = removeRoute;
  removeRoute = sinon.spy();

  var polyline_stubs = {
    "addTo": sinon.stub(),
    "getBounds": sinon.stub()
  };

  polyline_stubs.addTo.returns(polyline_stubs);
  polyline_stubs.getBounds.returns(polyline_stubs);

  var polyline_stub = sinon.stub(L, "polyline");
  polyline_stub.returns(polyline_stubs);

  map = {
    "fitBounds": sinon.spy()
  };

  var $_stubs = {
    "hide": sinon.spy(),
    "append": sinon.spy(),
  };

  $ = sinon.stub().returns($_stubs);

  var response = {
    paths: [
    {
      instructions: [
      {
        text: 'Test instruction',
        time: 50,
        distance: 5000
      },
      ],
    },
    ],
  };

  displayRoute(response);

  assert.ok(decodeRouteResponse.calledOnce, "Route response decoded correctly");
  assert.ok(decodeRouteResponse.calledWith(response), "Route response decoded correctly");

  assert.ok(L.polyline.calledWith(decodedResponse, {color: 'red'}), "Polyline created correctly");
  assert.ok(polyline_stubs.addTo.calledOnce, "Polyline shown on map correctly");
  assert.ok(polyline_stubs.addTo.calledWith(map), "Polyline shown on map correctly");

  assert.ok(map.fitBounds.calledOnce, "Map was zoomed in correctly");
  assert.ok(map.fitBounds.calledWith(polyline_stubs), "Map was zoomed in to the correct region");
  assert.ok(polyline_stubs.getBounds.calledOnce, "Map was zoomed in correctly");

  assert.ok(removeRoute.calledOnce, "Route polyline was hidden");

  assert.ok($_stubs.hide.calledOnce, "Hidden the weather info");
  var numAppends = response.paths[0].instructions.length + 1;
  assert.equal($_stubs.append.callCount, numAppends, "Added the right number of instructions");

  polyline_stub.restore();
  removeRoute = old_removeRoute;
  decodeRouteResponse = old_decodeRouteResponse;
});

QUnit.test("invertLatLngs", function (assert) {
  var test = [
    [1, 2],
    [3, 4],
  ];

  var expected = [
    [2, 1],
    [4, 3],
  ];

  var result = invertLatLngs(test);

  for (var i = 0; i < result.length; i++) {
    for (var j = 0; j < result[i].length; j++) {
      assert.equal(result[i][j], expected[i][j], "Coordinate is swapped correctly");
    }
  }
});

QUnit.test("instructionHtml", function (assert) {
  var test = {
    text: 'Test',
    time: 1000,
    distance: 1000,
  };

  var expected = '<div class="instruction"><p class="instruction-text">1. Test</p><div class="instruction-info"><div class="intruction-time">0 min</div><div class="intruction-dist">1.0 km</div></div></div>';

  var result = instructionHtml(1, test);

  assert.equal(result, expected, "Generated instruction html correctly");
});

QUnit.test("convertTimeUnit", function (assert) {
  assert.equal(convertTimeUnit(1*1000), "0 min", "Zero minute");
  assert.equal(convertTimeUnit(60*1000), "1 min", "Minutes are correct");
  assert.equal(convertTimeUnit(60*60*1000), "1 h0 min", "Hours are correct");
  assert.equal(convertTimeUnit(90*60*1000 + 30*1000), "1 h31 min", "Everything is correct");
});

QUnit.test("removeRoute", function (assert) {
  polyline = undefined;

  map = {
    "removeLayer": sinon.spy()
  };

  var $_stubs = {
    "empty": sinon.spy(),
    "show": sinon.spy(),
  };

  $ = sinon.stub().returns($_stubs);

  removeRoute();

  assert.equal(map.removeLayer.called, false, "Didn't remove empty route");
  assert.ok($_stubs.empty.called, "Removed instructions");
  assert.ok($_stubs.show.called, "Displayed weather info");

  var tmp_polyline = {};
  polyline = tmp_polyline;

  removeRoute();

  assert.ok(map.removeLayer.calledOnce, "Removed route");
  assert.ok(map.removeLayer.calledWith(tmp_polyline), "Removed correct route");
  assert.equal(polyline, undefined, "polyline unset correctly");
});

QUnit.test("testBrokenRouteObject", function(assert) {
  var fakeMarker = {
    "toGeoJSON": sinon.spy()
  };
  var objTest = createBrokenRouteObject("anything", "origin", "destination", fakeMarker, fakeMarker, fakeMarker);
  var objExpected = {
    texto: "anything",
    endereco_origem: "origin",
    endereco_destino: "destination",
  };
  assert.equal(objTest.texto, objExpected.texto, "(1) Object created successfully");
  assert.equal(objTest.endereco_origem, objExpected.endereco_origem, "(2) Object created successfully");
  assert.equal(objTest.endereco_destino, objExpected.endereco_destino, "(3) Object created successfully");
  assert.ok(fakeMarker.toGeoJSON.calledThrice, "(4) Object create successfully");
});
