// setup event handlers only after the DOM is ready
$(document).ready(function() {

  $("#route_button").click(function() {
    // TODO calculate route and display info
    console.log("Button clicked");
  });

  $(".address").focusout(function() {
    getGeocodeFromAddress(this);
  });

  (function () {
    // TODO test if there is no problem with both text boxes using
    // lastKeypressId at the same time (possible race condition)
    var lastKeypressId = 0;
    $(".address").keyup(function() {
      var targetId = lastKeypressId + 1;
      lastKeypressId = targetId;

      setTimeout(function() {
        if (lastKeypressId == targetId) {
          getGeocodeFromAddress(this);
        } else {
          console.log("usuario digitou");
        }
        // TODO adjust the timeout below
      }, 2000);
    });
  })();
  

});
