function getDinamic(){
  jsoncookie = {"dynamic" : "true"};

  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  if(!jsoncookie.hasOwnProperty("saveduser") || !jsoncookie.hasOwnProperty("iv")) window.location.replace("/account/login.html");

  $.ajax({
    url: "/php/account.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success: function(response){
      if(response["usrfound"] == 0) window.location.replace("/account/login.html");

      $("#nomedinamico").text("Ciao " + response["name"]);
      $("#nomeemaildinamico").html(response["name"] + " <br> " + response["email"]);
    },
    error: function(){ window.location.replace("/500.html"); }
  });
}

function removeChange(event){
  let id = event.target.id;
  let elem = $("#form_container");

  if(id == "firstinput" || id == "secondinput" || id == "changebutton" || id == "notequal") return false;
  
  if(!(id == "chemail" || id == "chpassword")) {
    elem.css("opacity", "0");
    elem.css("visibility", "hidden");
  } else {
    elem.css("opacity", "1");
    elem.css("visibility", "visible");
  }
}

function exitEveryWhere(){
  let confermed = confirm("Sei sicuro di voler disconnettere ogni altro account?");
  
  if(!confermed) return false;

  jsoncookie = {"changeToken":"true"};
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser" || point[0] == "temporary") jsoncookie[point[0]] = point[1];
  }

  $.ajax({
    url:"/php/account.php",   //the page containing php script
    type: "POST",             //request type,
    dataType: 'JSON',
    data: (jsoncookie),
    success: function(){ $("#remove").attr("hidden", true); $("#chemail").html("Cambia email <br>");},
    error: function(){ window.location.replace("/500.html"); }
  });
}

function change(id){
  if(id == "chemail"){
    $("#firstinput").attr('onblur', "checkEquality(\"email\")");
    $("#firstinput").attr('oninput', "checkEquality(\"email\")");
    $("#secondinput").attr('onblur', "checkEquality(\"email\")");
    $("#secondinput").attr('oninput', "checkEquality(\"email\")");

    $("#changebutton").text("Cambia email");
    $("#changebutton").attr("name", "email");
  } else {
    $("#firstinput").attr('onblur', "checkEquality(\"password\")");
    $("#firstinput").attr('oninput', "checkEquality(\"password\")");
    $("#secondinput").attr('onblur', "checkEquality(\"password\")");
    $("#secondinput").attr('oninput', "checkEquality(\"password\")");

    $("#changebutton").text("Cambia password");
    $("#changebutton").attr("name", "password");
  }
}

function checkEquality(type){
  $("#notequal").attr('hidden', true);
  $("#inputinvalido").attr('hidden', true);
  htmlElem = $("#firstinput");

  if(type == "email"){
    // I need to check it matches an email pattern
    const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    $("#inputinvalido").text("Email non valida");
    if(htmlElem.val() == "" || !re.test(htmlElem.val())){ $("#inputinvalido").removeAttr('hidden'); return false;}
  } else if(type == "password"){
    // I need to check it has at least the number of items required.
    $("#inputinvalido").text("Password non valida");
    passwd = htmlElem.val();

    // if it's empty, passwd will have a len of 0
    if(passwd.length == 0) { $("#inputinvalido").attr('hidden', true); return false; }
    else if(passwd.length < 8) { $("#inputinvalido").removeAttr('hidden'); return false; }
    else {
      uppercase = 0; lowercase = 0; special = 0; numbers = 0;
      for(let i = 0; i<passwd.length; i++){
        charnumber = passwd[i].charCodeAt(0);

        if((charnumber >= 33 && charnumber <= 47) || (charnumber >= 58 && charnumber <= 64) || (charnumber >= 91 && charnumber <= 96) || (charnumber >= 123 && charnumber <= 126)) special++;
        else if(charnumber >= 97 && charnumber <= 122) lowercase++;
        else if(charnumber >= 65 && charnumber <= 90) uppercase++;
        else if(charnumber >= 48 && charnumber <= 57) numbers++;
        else {
          $('#charunsupported').html("'" + passwd[i] + "' non supportato");
          $('#charunsupported').removeAttr('hidden');
          break;
        }
      }

      if(uppercase >= 2 && lowercase >= 2 && special >= 2 && numbers >= 2){ $("#inputinvalido").attr('hidden', true); return false; }
    }
  }

  // I can only check for the above requirements on one element. The other one must meet the same requiremenets anyway since they must be equal
  if($("#firstinput").val() != $("#secondinput").val()){
    $("#notequal").removeAttr('hidden');
    return false;
  } else return true;
}

function askChange(name){
  if(!checkEquality("" + name)){ alert("Le informazioni fornite non corrispondono"); return ; }

  key = "change" + name;
  jsoncookie = {}; jsoncookie[key] = "true";
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser" || point[0] == "temporary") jsoncookie[point[0]] = point[1];
  }
  
  jsoncookie[name + '1'] = $("#firstinput").val();
  jsoncookie[name + '2'] = $("#secondinput").val();

  let confermed = confirm("Sei sicuro di voler cambiare " + name + "?");
  if(!confermed) return false;

  console.log("sent");
  
  $.ajax({
    url:"/php/account.php",   //the page containing php script
    type: "POST",             //request type,
    dataType: 'JSON',
    data: (jsoncookie),
    success: function(response){
      if(response["error"] == "emailinvalid") {
        $("#inputinvalido").text("Email non valida");
        $("#inputinvalido").removeAttr('hidden');
      } else if(response["error"] == "passwordinvalid") {
        $("#inputinvalido").text("Password non valida");
        $("#inputinvalido").removeAttr('hidden');
      } 
      else if(response["error"] == "notequal") $("#notequal").removeAttr('hidden');
      else if(response["error"] == "emailtaken") alert("The email given has already been taken. Please try another one");
      
      if(response["type"] == "email"){
        $("#nomeemaildinamico").html($("#nomeemaildinamico").html().split(" <br> ")[0] + " <br> " + jsoncookie[name + '1']);
        alert("Email cambiata con successo! Tutti i dispositivi sono stati scollegati");
      } else if(response["type"] == "password") alert("Password cambiata con successo! Tutti i dispositivi sono stati scollegati.");

      $("#remove").attr("hidden", true);
      $("#chemail").html("Cambia email <br>");
    },
    error: function(){ window.location.replace("/500.html"); }
  });
}

function deleteAccount(){
  let confermed = confirm("Sei sicuro di voler eliminare il tuo account?");
  if(!confermed) return false;

  let email = prompt("Per favore ripeti la tua email: ");
  let password = prompt("Per favore, riscrivi la tua password: ");

  jsoncookie = {deleteaccount : true};
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser" || point[0] == "temporary") jsoncookie[point[0]] = point[1];
  }
  
  jsoncookie["email"] = email;
  jsoncookie["password"] = password;

  // ajax call
  $.ajax({
    url:"/php/account.php",   //the page containing php script
    type: "POST",             //request type,
    dataType: 'JSON',
    data: (jsoncookie),
    success: function(response){
      if(response["account"] == "deleted"){
        // deleting cookies
        document.cookie = "saveduser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "iv=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "temporary=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        alert("Il tuo account è stato eliminato con successo. Verrai ora reindirizzato alla homepage");
        window.location.replace("/homepage.html");
      } else if(response["account"] == "undelited"){
        if(response["error"] == "email|password") alert("L'email o la password inserite non sono corrette. Le modifiche non sono state apportate");
        else if(response["error"] == "unverified") {
          alert("Errore nella conferma dell'identità. Per favore, rifaccia il login per accedere alle impostazioni del suo account");

          // deleting cookies
          document.cookie = "saveduser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "iv=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "temporary=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          window.location.replace("/account/login.html");
        }
      }
    },
    error: function(){ window.location.replace("/500.html"); }
  });
}