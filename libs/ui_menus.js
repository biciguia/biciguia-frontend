/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

menuManager = new Object({
  // Menu states
  menuState: {
      'menu': false,
      'about': false,
      'rotaZoada': false,
      'report-broken-route': false
    },
  mapState: true,

  openMap: function () {
    $('#map-wrapper').show();
    this.mapState = true;  
  },

  closeMap: function () {
    $('#map-wrapper').hide();
    this.mapState = false;
  },

  openMenu: function (menuId) {
    if ($(document).width() <= 992) {
      this.closeMap();
    }
    // Open the menu
    $('#' + menuId).show();
    this.menuState[menuId] = true;
    // Hide other menus
    $.each(this.menuState, function(idx, value) {
      if (idx !== menuId) {
        menuManager.closeMenu(idx);
      }
    });
  },

  closeMenu: function (menuId) {
    $('#' + menuId).hide();
    this.menuState[menuId] = false;
    // If no other menus are active, show the map
    if(_.contains(_.values(this.menuState), true) === false) {
      this.openMap();
    }
  },

  toggleMapOnSmallScreen: function() {
    if(this.mapState === true) {
      this.openMenu('menu');
    } else { 
      this.closeAllMenus();
      this.openMap();
    }
  },

  closeAllMenus: function() {
    $.each(this.menuState, function(idx, value){
      if (this.menuState[idx] == true) {
        menuManager.closeMenu(idx);
      }
    });
  },
});

$(document).ready(initializeMenus);
function initializeMenus() {
  if($(document).width() >= 992) {
    menuManager.openMenu('menu');
  }

  // Set event handlers
  $(window).resize(resizeCallback);

  // TODO: Refactoring. These two pieces of code must be the same.
  $('#botao-menu').click(function() {
    mixpanel.track("menuClick");
    menuManager.toggleMapOnSmallScreen();
  });

  $('#go-button').click(function() {
    mixpanel.track("goButtonClick");
    menuManager.openMenu('menu');
  });

  $('#link-about').click(function() {
    mixpanel.track("aboutClick");
    menuManager.openMenu('about');
  });

  $("#broken-route-button").click(function() {
    mixpanel.track("brokenRouteClick");
    menuManager.openMenu('report-broken-route');
  });
}

function resizeCallback(evt) {
  if (window.innerWidth >= 992 && !menuManager.mapState) {
    menuManager.openMap();
  }
  if (window.innerWidth < 992 && menuManager.mapState) {
    menuManager.closeAllMenus();
  }
  if (window.innerWidth >= 992) {
    // If no other menus are active, show the menu
    if(_.contains(_.values(menuManager.menuState), true) === false) {
      menuManager.openMenu('menu');
    }
  }
  map.invalidateSize(true);
}
