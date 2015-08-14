fs = require('fs');
path = require('path');

function bind(f, a) {
  return function (b, c) {
    f(a, b, c);
  };
}

var overlaysDir = '../../../assets/overlays-original/';

fs.readdir(overlaysDir, function(err, files) {
  for (var i = 0; i < files.length; i++) {
    if (files[i].match(/\.json$/)) {
      fs.readFile(overlaysDir + files[i], 'utf8', bind(processFile, files[i]));
    }
  }
});

function processFile (fname, err, file) {
  var obj = createMarkersArray(JSON.parse(file));

  fs.writeFile(fname, JSON.stringify(obj), 'utf8', function() { console.log("Success writing "+fname); });
}

function createMarkersArray(fileJson) {
  var markers = [];
  for (var i = 0; i < fileJson.length; i++) {
    var place = fileJson[i];

    var marker = {
      "coords": [place.latitude, place.longitude],
      "description": "<h2>" + place.nome + "</h2><p>" + place.descricao + "</p>",
    };

    markers.push(marker);
  }

  return markers;
}
