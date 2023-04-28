function removeChange(event){
  let id = event.target.id;
  let elem = document.getElementById("form_container");

  if(id == "form_container" || id == "first_item" || id == "second_item" || id == "submit_item") return false;
  
  if(!(id == "cambiaemail" || id == "cambiapassword")) {
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
    success: function(){ document.getElementById("remove").setAttribute("hidden", true); }
  });
}

function getDinamic(){
  let jsoncookie = {"dynamic" : "true"};

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

      document.getElementById("nomeemaildinamico").innerHTML = response["name"] + " <br> " + response["email"];
    }
  });
}