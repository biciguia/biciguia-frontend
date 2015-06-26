/*
   Copyright © 2015 Biciguia Team

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

menuManager = new Object({
  menuState: {
      'menu': false,
      'about': false,
      'rotaZoada': false
    },

  mapState: true, // O mapa começa ligado

  openMap: function () {
    $('#map-wrapper').show();
    this.mapState = true;  
  },

  closeMap: function () {
    $('#map-wrapper').hide();
    menuManager.mapState = false;
  },

  openMenu: function (menuId) {
    // Se a tela for pequena, fecha o mapa!
    if ($(document).width() <= 992) {
      menuManager.closeMap();
    }
    // Abrimos o menu desejado
    $('#' + menuId).show();
    menuManager.menuState[menuId] = true;
    // E agora escondemos os outros menus!
    $.each(this.menuState, function(idx, value) {
      if (idx!==menuId) {
        menuManager.closeMenu(idx);
        menuManager.menuState[idx] = false;
      }
    });
  },

  closeMenu: function (menuId) {
    $('#' + menuId).hide();
    this.menuState[menuId] = false;
    // Se nenhum outro menu estiver ativado, a gente exibe o mapa
    if( _.contains(_.values(menuManager.menuState), true) === false) {
      menuManager.openMap();
    }
  },

  toggleMapOnSmallScreen: function() {
    var  width = $(document).width();
    //if(width >= 992) {console.log("Tela grande, vaza"); return;} // Se a tela for grande, vai embora
    //else 
    if(menuManager.mapState === true) {
      menuManager.openMenu('menu');
    } else {
      // Primeiro, se tiver algum menu ativo, desativa    
      closeAllMenus();
      menuManager.openMap();
    }
  },

  closeAllMenus: function() {
    $.each(this.menuState, function(idx, value){
      if (menuManager.menuState[idx] == true) {
        menuManager.closeMenu(idx);
      }
    });
  },
});

// Para rodar na inicialização. Se a tela for grande, recebe a tela normal
$(document).ready(function() {
  if($(document).width() >= 992) {
    menuManager.openMenu('menu');
  }
});

// TODO: Refactoring. These two pieces of code must be the same.
$('#botao-menu').click(function() {
  mixpanel.track("menuClick");
  menuManager.toggleMapOnSmallScreen();
// //We must have two functionalities here, one for big screens, other for small ones
//   if($(window).width() <= 992) {
//     $('#menu').animate({width: 'toggle'},{done: function(){map.invalidateSize(false);}});
//     $('#map-wrapper').toggle();
//   }
//   else {
//     $('#menu').animate({width: 'toggle'},{done: function(){map.invalidateSize(false);}});
//   }
});

$('#go-button').click(function() {
  mixpanel.track("goButtonClick");
  menuManager.openMenu('menu');
});
// $('#go-button').click(function() {
// //We must have two functionalities here, one for big screens, other for small ones
//   if($(window).width() <= 992) {
//     $('#menu').animate({width: 'toggle'},{done: function(){map.invalidateSize(false);}});
//     $('#map-wrapper').toggle();
//   }
//   else {
//     $('#menu').animate({width: 'toggle'},{done: function(){map.invalidateSize(false);}});
//   }
// });

$('#link-about').click(function() {
  mixpanel.track("aboutClick");
  menuManager.openMenu('about');
});

$(window).resize(resizeCallback);
function resizeCallback(evt) {
  if (window.innerWidth >= 992 && !menuManager.mapState) {
    menuManager.openMap();
  }
  if (window.innerWidth < 992 && menuManager.mapState) {
    menuManager.closeAllMenus();
  }
  if (window.innerWidth >= 992) {
    var menuShown = false;
    $.each(menuManager.menuState, function(idx, value){
      if (menuManager.menuState[idx] == true) {
        menuShown = true;
      }
    });
    if (!menuShown) {
      menuManager.openMenu('menu');
    }
  }
  map.invalidateSize(true);
}
