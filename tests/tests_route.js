/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

/* globals for mocking */
var routeLine;
var map;
var elev;
var decodePath;

QUnit.test("getRouterURL", function (assert) {
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

  var result = getRouterURL(origin, destination, options);

  var expected = 'http://104.131.18.160:8989/route?point=10%2C-10&point=20%2C-20&locale=pt_BR&instructions=true&vehicle=bike2&elevation=true';

  assert.equal(result, expected, "Route URL was generated correctly");
});

QUnit.test("addRouteToMap", function (assert) {
  // TODO: (TESTDAY) add tests (during test day)
  assert.ok(true, "TODO: add tests");
});

QUnit.test("showRoute", function (assert) {
  var decodedResponse = [[1, -1], [2, -2]];

  var old_decodeRouterResponse = decodeRouterResponse;
  decodeRouterResponse = sinon.stub().returns(decodedResponse);

  var old_removeRoute = removeRoute;
  removeRoute = sinon.spy();

  var old_addRouteToMap = addRouteToMap;
  addRouteToMap = sinon.spy();

  var $_stubs = {
    "hide": sinon.spy(),
    "append": sinon.spy(),
    "show": sinon.spy(),
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

  showRoute(response);

  assert.ok(decodeRouterResponse.calledOnce, "Route response decoded correctly");
  assert.ok(decodeRouterResponse.calledWith(response), "Route response decoded correctly");

  assert.ok(removeRoute.calledOnce, "Route polyline was hidden");

  assert.ok(addRouteToMap.calledOnce, "Route displayed correctly");
  assert.ok(addRouteToMap.calledWith(decodedResponse), "Route displayed correctly");

  assert.ok($_stubs.hide.calledOnce, "Hidden the weather info");
  assert.ok($_stubs.show.calledOnce, "Broken route button shown correctly");
  var numAppends = response.paths[0].instructions.length + 1;
  assert.equal($_stubs.append.callCount, numAppends, "Added the right number of instructions");

  removeRoute = old_removeRoute;
  decodeRouterResponse = old_decodeRouterResponse;
  addRouteToMap = old_addRouteToMap;
});

QUnit.test("generateInstructionHTML", function (assert) {
  var test = {
    text: 'Test',
    time: 1000,
    distance: 1000,
  };

  var expected = '<div class="instruction"><p class="instruction-text">1. Test</p><div class="instruction-info"><div class="intruction-time">0 min</div><div class="intruction-dist">1.0 km</div></div></div>';
  var result = generateInstructionHTML(1, test);
  assert.equal(result, expected, "Generated instruction html correctly");

  test = {
    text: 'Another test',
    time: 55,
    distance: 123,
  };

  expected = "<div class=\"instruction\"><p class=\"instruction-text\">2. Another test</p><div class=\"instruction-info\"><div class=\"intruction-time\">0 min</div><div class=\"intruction-dist\">123 m</div></div></div>";
  result = generateInstructionHTML(2, test);
  assert.equal(result, expected, "Generated instruction html correctly");
});

QUnit.test("convertTimeUnit", function (assert) {
  assert.equal(convertTimeUnit(1*1000), "0 min", "Zero minute");
  assert.equal(convertTimeUnit(60*1000), "1 min", "Minutes are correct");
  assert.equal(convertTimeUnit(60*60*1000), "1 h0 min", "Hours are correct");
  assert.equal(convertTimeUnit(90*60*1000 + 30*1000), "1 h31 min", "Everything is correct");
});

QUnit.test("removeRoute", function (assert) {
  routeLine = undefined;

  map = {
    "removeLayer": sinon.spy(),
    "hasLayer": sinon.stub().returns(true),
    "removeControl": sinon.spy(),
  };

  elev = {
    _map: 'test',
    clear: sinon.spy(),
  };

  var $_stubs = {
    "empty": sinon.spy(),
    "show": sinon.spy(),
    "hide": sinon.spy(),
  };

  $ = sinon.stub().returns($_stubs);

  var old_successfulRequestBrokenRoute = successfulRequestBrokenRoute;
  successfulRequestBrokenRoute = sinon.spy();

  removeRoute();

  assert.equal(map.removeLayer.called, false, "Didn't remove empty route");
  assert.ok($_stubs.empty.calledOnce, "Removed instructions");
  assert.ok($_stubs.show.calledOnce, "Displayed weather info");
  assert.ok($_stubs.hide.calledOnce, "Broken route information hidden correctly");
  assert.ok(successfulRequestBrokenRoute.calledOnce, "Reset broken route panel status");
  assert.ok(successfulRequestBrokenRoute.calledWith(true), "Reset broken route correctly");
  assert.ok(elev.clear.calledOnce, "Elevation cleared correctly");
  assert.ok(map.removeControl.calledWith(elev), "Elevation removed from map correctly");
  assert.ok(map.removeControl.calledOnce, "Elevation removed from map correctly");

  var tmp_routeLine = {};
  routeLine = tmp_routeLine;

  removeRoute();

  assert.ok(map.removeLayer.calledOnce, "Removed route");
  assert.ok(map.removeLayer.calledWith(tmp_routeLine), "Removed correct route");
  assert.equal(routeLine, undefined, "routeLine unset correctly");

  successfulRequestBrokenRoute = old_successfulRequestBrokenRoute;
});

QUnit.test("createBrokenRouteObject", function(assert) {
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

QUnit.test("decodeRouterResponse", function(assert) {
  decodePath = sinon.stub().returns("expected");

  var encoded = {
    paths: [{
      points: "test"
    }]
  };

  var result = decodeRouterResponse(encoded);

  assert.ok(decodePath.calledWith("test", true), "decodePath called correctly");
  assert.ok(decodePath.calledOnce, "decodePath called once");
  assert.equal(result, "expected", "Return value is correct");
});
