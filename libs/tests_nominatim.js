QUnit.test("getGeocoderURLFromAddress", function (assert) {
  var result = getGeocoderURLFromAddress("Rua do Matao, 1010");
  var expected = '//nominatim.openstreetmap.org/search?format=json&city=S%C3%A3o%20Paulo&state=S%C3%A3o%20Paulo&country=Brasil&street=Rua%20do%20Matao%2C%201010';

  assert.ok(result == expected, "URL returned is ok");
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
  var addressIME = [
  {"place_id":"90628654",
    "licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright",
    "osm_type":"way",
    "osm_id":"154079142",
    "boundingbox":["-23.5598092","-23.5589311","-46.7324506","-46.7317129"],
    "lat":"-23.55935105",
    "lon":"-46.732049560281",
    "display_name":"IME - Bloco B, 1010, Rua do Matão, Butantã, São Paulo, RMSP, São Paulo, Southeast Region, 05508-090, Brazil",
    "class":"building",
    "type":"yes",
    "importance":0.501}
  ];

  var expected = "<li class='pure-menu-item'><a href='#' id='origin-0' class='pure-menu-link origin-suggestion-item'>IME - Bloco B, 1010, Rua do Matão, Butantã, São Paulo, RMSP, São Paulo, Southeast Region, 05508-090, Brazil</a></li>";

  var result = getAddressListHTML(addressIME, 'origin');

  assert.equal(result.length, 1, "Result has expected length");

  assert.equal(result[0], expected, "Result has expected item html");
});

QUnit.test("hideAddressList", function (assert) {
  var orig_$ = $;

  var obj = {
    "empty": sinon.spy(),
    "hide": sinon.spy()
  };

  $ = sinon.stub().returns(obj);

  hideAddressList('origin');

  assert.ok($.calledWith('#origin-table'), "#origin-table reached correctly");
  assert.ok($.calledWith('#origin-heading'), "#origin-heading reached correctly");

  assert.ok(obj.empty.calledOnce, "The list is emptied");
  assert.ok(obj.hide.calledTwice, "The elements are hidden");

  $ = orig_$;
});
