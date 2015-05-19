//var menu_ligado = true;


$('#botao-menu').click(function() {
  //Temos que ter duas funções, uma para tela pequena, outra para tela grande
  if($(window).width() <= 992) {
    $('#menu').animate({width: 'toggle'});
    $('#map').toggle();
    map.invalidateSize(); //Para fazer os tiles do mapa carregarem
  }
  else {
    $('#menu').animate({width: 'toggle'});
  }
});