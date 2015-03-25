QUnit.test( "hello test", function ( assert ) {
    var result = JSON.stringify(getGeocodeFromAddress("Rua do Matao, 1010"));
    var expected = '[{"place_id":"90628654","licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright","osm_type":"way","osm_id":"154079142","boundingbox":["-23.5598092","-23.5589311","-46.7324506","-46.7317129"],"lat":"-23.55935105","lon":"-46.732049560281","display_name":"IME - Bloco B, 1010, Rua do Matão, Butantã, São Paulo, RMSP, São Paulo, Southeast Region, 05508-090, Brazil","class":"building","type":"yes","importance":0.711}]'
    assert.ok(result == expected, "Passed!" );
});
