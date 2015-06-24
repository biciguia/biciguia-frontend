/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

QUnit.test("bind2ndArgument", function (assert) {
  var callback = sinon.spy();

  var newFn = bind2ndArgument(callback, 'origin');

  newFn('test');
  assert.ok(callback.calledWith('test', 'origin'), "Arguments are passed correctly");

  newFn('test2');
  assert.ok(callback.calledWith('test2', 'origin'), "The function doesn't register incorrect arguments");

  assert.notEqual(callback.calledWith('test', 'destination'), true, "The bound argument is passed correctly");
});

QUnit.test("isLatLonString", function (assert) {
  var correctLatLon1 = "23,46";
  var correctLatLon2 = "-23,  -46 ";
  var correctLatLon3 = "-23.123,-46";
  var correctLatLon4 = "  -23.12   , -46.123  ";
  var wrongLatLon1 = "IME -23,46";
  var wrongLatLon2 = "-23.123";
  var wrongLatLon3 = "-23.,-46";
  var wrongLatLon4 = " - 23, - 46";
  var wrongLatLon5 = " -23, -4 6";

  assert.ok(isLatLonString(correctLatLon1), "accepts unsigned latlon");
  assert.ok(isLatLonString(correctLatLon2), "accepts signed latlon and spaces");
  assert.ok(isLatLonString(correctLatLon3), "accepts signed latlon with decimals");
  assert.ok(isLatLonString(correctLatLon4), "accepts signed latlon, spaces and decimals");
  assert.ok(!isLatLonString(wrongLatLon1), "denies letters");
  assert.ok(!isLatLonString(wrongLatLon2), "denies if only one coordinate is passed");
  assert.ok(!isLatLonString(wrongLatLon3), "denies coordinate with dot and without decimals");
  assert.ok(!isLatLonString(wrongLatLon4), "denies spaces between number and it's signal");
  assert.ok(!isLatLonString(wrongLatLon5), "denies spaces between numbers of the same coordinate");
});
