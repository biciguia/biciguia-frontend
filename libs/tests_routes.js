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

/* globals for mocking */
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

  var expected = 'http://104.131.18.160:5000/viaroute?loc=10,-10&loc=20,-20&instructions=true';

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

  var response = "dummy";

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

  polyline_stub.restore();
  removeRoute = old_removeRoute;
  decodeRouteResponse = old_decodeRouteResponse;
});

QUnit.test("removeRoute", function (assert) {
  polyline = undefined;

  map = {
    "removeLayer": sinon.spy()
  };

  removeRoute();

  assert.equal(map.removeLayer.called, false, "Didn't remove empty route");

  var tmp_polyline = {};
  polyline = tmp_polyline;

  removeRoute();

  assert.ok(map.removeLayer.calledOnce, "Removed route");
  assert.ok(map.removeLayer.calledWith(tmp_polyline), "Removed correct route");
  assert.equal(polyline, undefined, "polyline unset correctly");
});
