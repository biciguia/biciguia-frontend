/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

function errorCallback() {
  console.log("ERROR");
}

// receives a function f and an argument s
// and returns a function that takes an argument d
// that runs f(d, s)
function bind2ndArgument(callback, source) {
  return function(data) { callback(data, source);};
}

spinner = createSpinner();
function createSpinner() {
  var opts = {
    lines: 7, // The number of lines to draw
    length: 0, // The length of each line
    width: 4, // The line thickness
    radius: 4, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb or array of colors
    speed: 2, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '8px', // Top position relative to parent
    left: '50%' // Left position relative to parent
  };

  var spinner = new Spinner(opts);
  return spinner;
}

function isLatLonString(value) {
  if (value.match('^[ ]*[+|-]?[0-9]+([.]([0-9]+))?[ ]*[,][ ]*[+|-]?[0-9]+([.]([0-9]+))?[ ]*$'))
    return true;
  return false;
}
