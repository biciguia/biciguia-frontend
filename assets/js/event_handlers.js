// setup event handlers only after the DOM is ready
$(document).ready(function() {

  $("#route_button").click(function() {
    // TODO calculate route and display info
    console.log("Button clicked");
  });

  var madeRequest = false;

  $(".address").focusout(function(event) {
    if (!madeRequest) {
      madeRequest = true;
      if (event.target.id == 'origin_address') {
        getGeocodeFromAddress(event.target, 'origin');
      } else {
        getGeocodeFromAddress(event.target, 'destination');
      }
    }
  });

  // TODO test if there is no problem with both text boxes using
  // lastKeypressId at the same time (possible race condition)
  var lastKeypressId = 0;
  $(".address").keyup(function(event) {
    var targetId = lastKeypressId + 1;
    lastKeypressId = targetId;

    madeRequest = false;

    setTimeout(function() {
      if (lastKeypressId == targetId) {
        if (!madeRequest) {
          madeRequest = true;
          if (event.target.id == 'origin_address') {
            getGeocodeFromAddress(event.target, 'origin');
          } else {
            getGeocodeFromAddress(event.target, 'destination');
          }
        }
      } else {
        console.log("usuario digitou");
      }
      // TODO adjust the timeout below
    }, 2000);
  });


});

function menuItemSelectedAddressWrapper(addressesList) {
  return function(event) { menuItemSelected(event, addressesList); };
}

function menuItemSelected(event, addressesList) {
  if(event.target.id.match('origin')) {
     $('#origin_address').val(event.target.innerHTML);
  } else {
    $('#destination_address').val(event.target.innerHTML);
  } 
}
