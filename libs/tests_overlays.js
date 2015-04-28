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

QUnit.test("createMarkersArray", function (assert) {
  var result = createMarkersArray(place);

  assert.equal(result.length, 2, "Result has the correct lenght");

  var desc1 = "<h2>Teste</h2><p>Descricao teste</p>";
  assert.equal(result[0].description, desc1, "Object 1 has the correct description");
  assert.equal(result[0].coords[0], place[0].latitude, "Object 1 has the correct latitude");
  assert.equal(result[0].coords[1], place[0].longitude, "Object 1 has the correct longitude");

  var desc2 = "<h2>Teste2</h2><p>Descricao teste2</p>"
  assert.equal(result[1].description, desc2, "Object 2 has the correct description");
  assert.equal(result[1].coords[0], place[1].latitude, "Object 2 has the correct latitude");
  assert.equal(result[1].coords[1], place[1].longitude, "Object 2 has the correct longitude");
});

QUnit.test("createLeafletMarkers", function (assert) {
  var marker_stubs = {
    "bindPopup": sinon.spy()
  };

  var marker_stub = sinon.stub(L, "marker");
  marker_stub.returns(marker_stubs);

  var layergroup_stub = sinon.stub(L, "layerGroup");

  createLeafletMarkers(place);
  assert.ok(marker_stub.calledTwice, "Created the markers correctly");
  assert.ok(marker_stubs.bindPopup.calledTwice, "Created the popups correctly");

  assert.ok(layergroup_stub.calledOnce, "Created the layer group with all the markers");
  // TODO Check if markers are receiving correct coordinates and descriptions
  // TODO Check if layergroup is receiving the markers
  // TODO Check if L.control.layers is being created and added to map correctly
  // TODO Check if the control is only added after __count reaches the length of overlayFiles

  layergroup_stub.restore();
  marker_stub.restore();
});
