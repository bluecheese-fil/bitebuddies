$(document).ready(function() {

    $('#cerca').on('keydown', function(event) {
      if(event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        var name=$(this).val();
        window.open(name+".html", '_blank');
      }
    });

    /*$("#grid").hide();

    var timer;
    $("#question").hover(function() {
      $("#grid").fadeIn();
    }, function() {
      timer=setTimeout(function() { $("#grid").fadeOut(); }, 1000);
    });
    $("#grid").hover(function() {
      clearTimeout(timer);
    }, function() {
      $("#grid").fadeOut(300);
    });*/

    conta1=0;
    $("#bottone_sx1").prop("disabled", true);
    $("#bottone_dx1").click(function() {
      var cucina=$(".table1");
      for(var i=0; i<9; i++) {
        $(cucina[i]).animate({left: "-=20%"}, 500);
      }
      conta1++;
      if(conta1==0) {
        $("#bottone_sx1").prop("disabled", true);
      }
      if(conta1>0 && conta1<2) {
        $("#bottone_sx1").prop("disabled", false);
        $("#bottone_dx1").prop("disabled", false);
      }
      if(conta1==2) {
        $("#bottone_dx1").prop("disabled", true);
      }
    });
    $("#bottone_sx1").click(function() {
      var cucina=$(".table1");
      for(var i=0; i<9; i++) {
        $(cucina[i]).animate({left: "+=20%"}, 500);
      }
      conta1--;
      if(conta1==0) {
        $("#bottone_sx1").prop("disabled", true);
      }
      if(conta1>0 && conta1<2) {
        $("#bottone_sx1").prop("disabled", false);
        $("#bottone_dx1").prop("disabled", false);
      }
      if(conta1==2) {
        $("#bottone_dx1").prop("disabled", true);
      }
    });

    conta2=0;
    $("#bottone_sx2").prop("disabled", true);
    $("#bottone_dx2").click(function() {
      conta2++;
      var cucina2=$(".table2");
      for(var i=0; i<8; i++) {
        $(cucina2[i]).animate({left: "-=20%"}, 400);
      }
      if(conta2==0) {
        $("#bottone_sx2").prop("disabled", true);
      }
      if(conta2>0 && conta2<2) {
        $("#bottone_sx2").prop("disabled", false);
        $("#bottone_dx2").prop("disabled", false);
      }
      if(conta2==2) {
        $("#bottone_dx2").prop("disabled", true);
      }
    });
    $("#bottone_sx2").click(function() {
      var cucina2=$(".table2");
      for(var i=0; i<8; i++) {
        $(cucina2[i]).animate({left: "+=20%"}, 400);
      }
      conta2--;
      if(conta2==0) {
        $("#bottone_sx2").prop("disabled", true);
      }
      if(conta2>0 && conta2<2) {
        $("#bottone_sx2").prop("disabled", false);
        $("#bottone_dx2").prop("disabled", false);
      }
      if(conta2==2) {
        $("#bottone_dx2").prop("disabled", true);
      }
    });

    $("#bottone_basso").click(function() {
      $('html, body').animate({scrollTop: 679}, 100);
    });

    /*
    var elementoWidth = document.querySelector('#mcdonalds').offsetWidth;
    var contenitoreWidth = document.querySelector('.wrapper').offsetWidth;
    var percentualeSpazio = (elementoWidth / contenitoreWidth) * 100;

    console.log('Percentuale di spazio occupato: ' + percentualeSpazio + '%');

    var elementoWidth = document.querySelector('#kfc').offsetWidth;
    var contenitoreWidth = document.querySelector('.wrapper').offsetWidth;
    var percentualeSpazio = (elementoWidth / contenitoreWidth) * 100;

    console.log('Percentuale di spazio occupato: ' + percentualeSpazio + '%');

    var elementoWidth = document.querySelector('#fiveguys').offsetWidth;
    var contenitoreWidth = document.querySelector('.wrapper').offsetWidth;
    var percentualeSpazio = (elementoWidth / contenitoreWidth) * 100;

    console.log('Percentuale di spazio occupato: ' + percentualeSpazio + '%');

    var elementoWidth = document.querySelector('#subway').offsetWidth;
    var contenitoreWidth = document.querySelector('.wrapper').offsetWidth;
    var percentualeSpazio = (elementoWidth / contenitoreWidth) * 100;

    console.log('Percentuale di spazio occupato: ' + percentualeSpazio + '%');

    var elementoWidth = document.querySelector('#alice_pizza').offsetWidth;
    var contenitoreWidth = document.querySelector('.wrapper').offsetWidth;
    var percentualeSpazio = (elementoWidth / contenitoreWidth) * 100;

    console.log('Percentuale di spazio occupato: ' + percentualeSpazio + '%');*/
  });