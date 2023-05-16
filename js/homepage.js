function isLogged() {
  let jsoncookie = {};
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  if(!jsoncookie.hasOwnProperty("saveduser") || !jsoncookie.hasOwnProperty("iv")){ $("#personallogin").remove(); return ; }

  $.ajax({
    url: "/php/homepage.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success: function(response){
      if(response["usrfound"] == 0) $("#personallogin").remove();
      else {
        $("#name").text("Ciao " + response["name"]);
        $("#personallogin").removeAttr("hidden"); $("#fastredirect").remove();
      }
    },
    error: function(){ 
      console.log("Server error");
      alert("A causa di un errore del server, al momento non è possibile accedere al proprio account o fare ordini. Ci scusiamo per il disagio");
    }
  });
}

function loadHomepage(){
  $('#cerca').on('keydown', function(event) {
    if(event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      var name = $(this).val();
      window.open(name + ".html", '_blank');
    }
  });

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
}

function tutteCucine() {
  let jsoncookie={"tutteCucine" : "true"};
  $.ajax({
      url: "/php/cucina.php",
      type: "POST",
      dataType: "JSON",
      data: (jsoncookie),
      success:function(response) {
        console.log(response);
        for(var i=0; i<response.length; i++) {
          var link=`<a href="categorie/${response[i]['categoria']}.html"><li>${response[i]['categoria']}</li></a>`;
          $("#finale_cuc").append(link);
        }
        if(response.length>7) {
          var scorri=`<img class="down_arrow" src="/images/static/down-arrow.png">`;
          $(".freccia_sotto#cuc").append(scorri);
        }
      }
  });
}

function tuttiRistoranti() {
  let jsoncookie={"tuttiRistoranti" : "true"};
  $.ajax({
      url: "/php/cucina.php",
      type: "POST",
      dataType: "JSON",
      data: (jsoncookie),
      success:function(response) {
        console.log(response);
        for(var i=0; i<response.length; i++) {
          var link=`<a href="ristoranti/${response[i]['nome']}.html"><li>${response[i]['nome']}</li></a>`;
          $("#finale_rist").append(link);
        }
        if(response.length>7) {
          var scorri=`<img class="down_arrow" src="/images/static/down-arrow.png">`;
          $(".freccia_sotto#rist").append(scorri);
        }
      }
  });
}

var aggiunti = [];
function tenda(array) {
  for(var i=0; i<array.length; i++) {
    if(!aggiunti.includes(array[i])) {
      var opzione=`<option value="${array[i]}">`;
      $("#selezione").append(opzione);
      var datalist = document.getElementById('selezione');
      datalist.style.display='block';
      aggiunti.push(array[i]);
    }
  }
}

function getSuggerimenti(lettere) {
    let jsoncookie={"getSuggerimenti" : "true"};
    $.ajax({
        url: "/php/cucina.php",
        type: "POST",
        dataType: "JSON",
        data: (jsoncookie),
        success:function(response) {
          if(lettere.length>0) {
            var array=[];
            for(var j=0; j<response.length; j++) {
              var ristorante=response[j]["nome"];
              var verificato=1;
              for(var i=0; i<lettere.length; i++) {
                if(ristorante[i]!=lettere[i]) verificato=0;
              }
              if(verificato==1 && !array.includes(ristorante)) array.push(ristorante);
            }
            console.log(array);
            tenda(array);
          }
        }
    });
}

function cerca(event) {
  if(event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault();
    var name = $(this).val();
    $.ajax({
      url: "/ristoranti/" + name + ".html",
      type: "HEAD",
      success: function() {
        window.open("/ristoranti/" + name + ".html", "_blank");
      },
      error: function() {
        var input=document.getElementById("cerca");
        var existingText=input.value;
        var newText=existingText+"   Questo ristorante non esiste...";
        input.value=newText;
        $("#cerca").click(function() {
          input.value="";
        });
        input.addEventListener('keydown', function(event) {
          if(event.key==="Backspace") {
            input.value="";
          }
        });
      }
    });
  }
}

function scroll() {
  $('html, body').animate({scrollTop: 679}, 10);
}

function loadHomepage(){
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
}