/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

QUnit.module("address");

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

  var old_getSelectedAddressElement = getSelectedAddressElement;
  getSelectedAddressElement = sinon.stub().returns('origin');

  $ = sinon.stub().returns(test_stubs);

  showAddressList(addressIME, 'origin');

  assert.ok($.calledWith("#origin-table"), "#origin-table reached correctly");
  assert.ok($.calledWith(".origin-suggestion-item"), ".origin-suggestion-item reached correctly");

  assert.ok(test_stubs.empty.calledOnce, "The list is emptied");
  assert.ok(test_stubs.show.calledOnce, "The elements are shown");
  assert.ok(test_stubs.append.calledOnce, "The elements are added to the list");
  assert.ok(test_stubs.click.calledOnce, "The click handlers are changed");

  getSelectedAddressElement = old_getSelectedAddressElement;
});
