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
  conta1=0;
  $("#bottone_sx1").prop("disabled", true);
  $("#bottone_dx1").click(function() {
    var cucina=$(".table1");
    for(var i=0; i<9; i++) {
      $(cucina[i]).animate({marginLeft: "-=116%"}, 400);
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
      $(cucina[i]).animate({marginLeft: "+=116%"}, 400);
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
          var link=`<a href="ristoranti.html?id=${response[i]['rest_id']}"><li>${response[i]['nome']}</li></a>`;
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
    let jsoncookie={"loadContenuto" : "true"};
    $.ajax({
      url: "/php/cucina.php",
      type: "POST",
      dataType: "JSON",
      data: (jsoncookie),
      success: function(response) {
        var id="";
        for(var i=0; i<response.length; i++) {
          if(response[i]['nome']==name) {
            id=response[i]['rest_id'];
            break;
          }
        }
        window.open("/ristoranti.html?id="+id, "_blank");
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

function cercaRistorante() {
  var lettere=[];
  var textarea=document.getElementById('cerca');
  textarea.addEventListener('input', function(event) {
    var inputEvent=event.inputType;
    var inputValue=event.target.value;
    if (inputEvent=='insertText' && inputValue.length > 0) {
      var character=inputValue.charAt(inputValue.length - 1);
      lettere.push(character);
      console.log(lettere);
      getSuggerimenti(lettere);
    }
  });
  textarea.addEventListener('keydown', function(event) {
    if (event.key==="Backspace") {
      var carattereCancellato = textarea.value.charAt(textarea.selectionStart - 1);
      lettere.splice(lettere.length-1);
      getSuggerimenti(lettere);
    }
  });
}

function scroll() {
  scrollAmount = Number.parseFloat($(".contenitore").position()["top"]) + Number.parseFloat($(".contenitore").height());
  $('html, body').animate({scrollTop: scrollAmount}, 10);
}