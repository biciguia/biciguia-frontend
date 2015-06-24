/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */
var menuManager;

var maxBounds = {
    bottom: -24.317,
    left: -47.357,
    top: -23.125,
    right: -45.863,
  };

var insideBounds = {
    bottom: -24.000,
    left: -47.000,
    top: -23.500,
    right: -46.000,
  };

var outsideBounds = {
    bottom: -25.000,
    left: -48.000,
    top: -23.000,
    right: -45.000,
  };

var place = [
   {
    "latitude": 5,
    "longitude": -5,
    "nome": "Teste",
    "descricao": "Descricao teste"
  },
  {
    "latitude": 10,
    "longitude": -10,
    "nome": "Teste2",
    "descricao": "Descricao teste2"
  }
  ];

var desc1 = "<h2>Teste</h2><p>Descricao teste</p>";
var desc2 = "<h2>Teste2</h2><p>Descricao teste2</p>";

QUnit.test("ensureMapViewBounds", function (assert) {
  var resultInsideBounds = ensureMapViewBounds(insideBounds);

  assert.ok(resultInsideBounds.bottom >= maxBounds.bottom, "Result for coords inside bounds respects bottom bound");
  assert.ok(resultInsideBounds.left >= maxBounds.left, "Result for coords inside bounds respects left bound");
  assert.ok(resultInsideBounds.top <= maxBounds.top, "Result for coords inside bounds respects top bound");
  assert.ok(resultInsideBounds.right <= maxBounds.right, "Result for coords inside bounds respects right bound");

  var resultOutOfBounds = ensureMapViewBounds(outsideBounds);

  assert.ok(resultOutOfBounds.bottom >= maxBounds.bottom, "Result for coords outside bounds respects bottom bound");
  assert.ok(resultOutOfBounds.left >= maxBounds.left, "Result for coords outside bounds respects left bound");
  assert.ok(resultOutOfBounds.top <= maxBounds.top, "Result for coords outside bounds respects top bound");
  assert.ok(resultOutOfBounds.right <= maxBounds.right, "Result for coords outside bounds respects right bound");
});

QUnit.test("coordsToLeafletBounds", function (assert) {
  var testBounds = {
    bottom: 1,
    left: 2,
    top: 3,
    right: 4,
  };

  var latLng_stub = sinon.stub(L, "latLng");
  latLng_stub.returns('expected');

  var latLngBounds_stub = sinon.stub(L, "latLngBounds");
  latLngBounds_stub.returns('expected');

  var result = coordsToLeafletBounds(testBounds);

  assert.equal(result, 'expected', "Coordinate changed correctly");
  assert.equal(latLng_stub.callCount, 2, "Coordinates constructed correctly");
  assert.ok(latLng_stub.calledWith(1, 2), "Coordinates constructed correctly");
  assert.ok(latLng_stub.calledWith(3, 4), "Coordinates constructed correctly");
  assert.ok(latLngBounds_stub.calledOnce, "Bounds constructed correctly");
  assert.ok(latLngBounds_stub.calledWith('expected', 'expected'), "Bounds constructed correctly");

  latLng_stub.restore();
  latLngBounds_stub.restore();
});

QUnit.test("createMarkersArray", function (assert) {
  var result = createMarkersArray(place);

  assert.equal(result.length, 2, "Result has the correct lenght");
  assert.equal(result[0].description, desc1, "Object 1 has the correct description");
  assert.equal(result[0].coords[0], place[0].latitude, "Object 1 has the correct latitude");
  assert.equal(result[0].coords[1], place[0].longitude, "Object 1 has the correct longitude");

  assert.equal(result[1].description, desc2, "Object 2 has the correct description");
  assert.equal(result[1].coords[0], place[1].latitude, "Object 2 has the correct latitude");
  assert.equal(result[1].coords[1], place[1].longitude, "Object 2 has the correct longitude");
});

QUnit.test("resizeMapElements", function(assert){
  var stubs = {
    "hide": sinon.spy(),
    "show": sinon.spy()
  };

  $ = sinon.stub().returns(stubs);

  menuManager = {
    "mapState": true
  };

  resizeMapElements(1000, 1000);

  assert.ok(stubs.hide.calledOnce, "Button is not visible when the screen is large");

});

QUnit.test("createLeafletMarkers", function (assert) {
  var marker_stubs = {
    "bindPopup": sinon.spy()
  };

  var control_stubs = {
    "addTo": sinon.spy()
  }

  var marker_stub = sinon.stub(L, "marker");
  L.marker.returns(marker_stubs);

  var layergroup_stub = sinon.stub(L, "layerGroup");

  createLeafletMarkers(place);

  assert.ok(L.marker.calledTwice, "Created the markers correctly");
  assert.ok(marker_stubs.bindPopup.calledTwice, "Created the popups correctly");

  assert.ok(L.layerGroup.calledOnce, "Created the layer group with all the markers");
  assert.ok(L.marker.calledWith([5, -5]), "1 Was called with corrects arguments");
  assert.ok(L.marker.calledWith([10, -10]), "2 Was called with corrects arguments");

  assert.ok(marker_stubs.bindPopup.calledWith(desc1), "1 was called with description argument correctly");
  assert.ok(marker_stubs.bindPopup.calledWith(desc2), "2 was called with description argument correctly");
  // check first argument of first call
  assert.ok(L.layerGroup.args[0][0].length == 2, "layerGroup was created with correct number of markers");

  var control_stub = sinon.stub(L.control, "layers");
  L.control.layers.returns(control_stubs);

  while (__count != undefined) {
    createLeafletMarkers(place);
  }

  assert.ok(L.control.layers.calledOnce, "Layer control created correctly");
  assert.ok(control_stubs.addTo.calledOnce, "Controls added to the map");
  control_stub.restore();

  layergroup_stub.restore();
  marker_stub.restore();
});
