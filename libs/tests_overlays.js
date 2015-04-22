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

QUnit.test("createJsonMarkers", function (assert) {
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

  var result = createJsonMarkers(place);

  assert.equal(result.length, 2, "Result has the correct lenght");

  assert.equal(result[0].description, place[0].nome + "\n" + place[0].descricao,
      "Object 1 has the correct description");
  assert.equal(result[0].coords[0], place[0].latitude, "Object 1 has the correct latitude");
  assert.equal(result[0].coords[1], place[0].longitude, "Object 1 has the correct longitude");

  assert.equal(result[1].description, place[1].nome + "\n" + place[1].descricao,
      "Object 2 has the correct description");
  assert.equal(result[1].coords[0], place[1].latitude, "Object 2 has the correct latitude");
  assert.equal(result[1].coords[1], place[1].longitude, "Object 2 has the correct longitude");
});
