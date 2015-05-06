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
