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

      document.getElementById("nomedinamico").textContent = response["name"];
      document.getElementById("nomeemaildinamico").innerHTML = response["name"] + " <br> " + response["email"];
    }
  });
}

function removeChange(event){
  let id = event.target.id;
  let elem = document.getElementById("form_container");

  if(id == "firstinput" || id == "secondinput" || id == "changebutton" || id == "notequal") return false;
  
  if(!(id == "chemail" || id == "chpassword")) {
    elem.style.opacity = "0";
    elem.style.visibility = "hidden";
  } else {
    elem.style.opacity = "1";
    elem.style.visibility = "visible";
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
    success: function(){ document.getElementById("remove").setAttribute("hidden", true); document.getElementById("chemail").innerHTML = "Cambia email <br>"; }
  });
}

function change(id){
  if(id == "chemail"){
    document.getElementById("firstinput").setAttribute('onblur', "checkEquality(\"email\")");
    document.getElementById("firstinput").setAttribute('oninput', "checkEquality(\"email\")");
    document.getElementById("secondinput").setAttribute('onblur', "checkEquality(\"email\")");
    document.getElementById("secondinput").setAttribute('oninput', "checkEquality(\"email\")");

    document.getElementById("changebutton").textContent = "Cambia email";
    document.getElementById("changebutton").name = "email";
    
  } else {
    document.getElementById("firstinput").setAttribute('onblur', "checkEquality(\"password\")");
    document.getElementById("firstinput").setAttribute('oninput', "checkEquality(\"password\")");
    document.getElementById("secondinput").setAttribute('onblur', "checkEquality(\"password\")");
    document.getElementById("secondinput").setAttribute('oninput', "checkEquality(\"password\")");

    document.getElementById("changebutton").textContent = "Cambia password";
    document.getElementById("changebutton").name = "password";
  }
}

function checkEquality(type){
  document.getElementById("notequal").setAttribute('hidden', true);
  document.getElementById("inputinvalido").setAttribute('hidden', true);
  htmlElem = document.getElementById("firstinput");

  if(type == "email"){
    // I need to check it matches an email pattern
    const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    document.getElementById("inputinvalido").textContent = "Email non valida";
    if(htmlElem.value == "" || !re.test(htmlElem.value)){ document.getElementById("inputinvalido").removeAttribute('hidden'); return false;}
  } else if(type == "password"){
    // I need to check it has at least the number of items required.
    document.getElementById("inputinvalido").textContent = "Password non valida";
    passwd = htmlElem.value;

    // if it's empty, passwd will have a len of 0
    if(passwd.length == 0) { document.getElementById("inputinvalido").setAttribute('hidden', true); return false; }
    else if(passwd.length < 8) { document.getElementById("inputinvalido").removeAttribute('hidden'); return false; }
    else {
      uppercase = 0; lowercase = 0; special = 0; numbers = 0;
      for(let i = 0; i<passwd.length; i++){
        charnumber = passwd[i].charCodeAt(0);

        if((charnumber >= 33 && charnumber <= 47) || (charnumber >= 58 && charnumber <= 64) || (charnumber >= 91 && charnumber <= 96) || (charnumber >= 123 && charnumber <= 126)) special++;
        else if(charnumber >= 97 && charnumber <= 122) lowercase++;
        else if(charnumber >= 65 && charnumber <= 90) uppercase++;
        else if(charnumber >= 48 && charnumber <= 57) numbers++;
        else {
          document.getElementById('charunsupported').innerHTML = ("'" + passwd[i] + "' non supportato");
          document.getElementById('charunsupported').removeAttribute('hidden');
          break;
        }
      }

      if(uppercase >= 2 && lowercase >= 2 && special >= 2 && numbers >= 2){ document.getElementById("inputinvalido").setAttribute('hidden', true); return false; }
    }
  }

  // I can only check for the above requirements on one element. The other one must meet the same requiremenets anyway since they must be equal
  if(document.getElementById("firstinput").value != document.getElementById("secondinput").value){
    document.getElementById("notequal").removeAttribute('hidden');
    return false;
  } else return true;
}

function askChange(name){
  if(!checkEquality("" + name)){ alert("Le informazioni fornite non corrispondono"); return ; }

  key = "change" + name;
  jsoncookie = {}; jsoncookie[key] = "true"
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser" || point[0] == "temporary") jsoncookie[point[0]] = point[1];
  }
  
  jsoncookie[name + '1'] = document.getElementById("firstinput").value;
  jsoncookie[name + '2'] = document.getElementById("secondinput").value;

  let confermed = confirm("Sei sicuro di voler cambiare " + name + "?");
  if(!confermed) return false;

  console.log("sent");
  
  $.ajax({
    url:"/php/account.php",   //the page containing php script
    type: "POST",             //request type,
    dataType: 'JSON',
    data: (jsoncookie),
    success: function(response){
      console.log(response);

      if(response["error"] == "emailinvalid") {
        document.getElementById("inputinvalido").textContent = "Email non valida";
        document.getElementById("inputinvalido").removeAttribute('hidden');
      } else if(response["error"] == "passwordinvalid") {
        document.getElementById("inputinvalido").textContent = "Password non valida";
        document.getElementById("inputinvalido").removeAttribute('hidden');
      } 
      else if(response["error"] == "notequal") document.getElementById("notequal").removeAttribute('hidden');
      else if(response["error"] == "emailtaken") alert("The email given has already been taken. Please try another one");
      
      if(response["type"] == "email"){
        document.getElementById("nomeemaildinamico").innerHTML = document.getElementById("nomeemaildinamico").innerHTML.split(" <br> ")[0] + " <br> " + jsoncookie[name + '1'];
        alert("Email cambiata con successo! Tutti i dispositivi sono stati scollegati");
      } else if(response["type"] == "password") alert("Password cambiata con successo! Tutti i dispositivi sono stati scollegati.");

      document.getElementById("remove").setAttribute("hidden", true);
      document.getElementById("chemail").innerHTML = "Cambia email <br>";
    }
  });
}