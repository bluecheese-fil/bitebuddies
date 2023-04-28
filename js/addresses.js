function checkInd(){
  document.getElementById("errorindirizzo").setAttribute("hidden", true);
  document.getElementById("capinvalida").setAttribute("hidden", true);

  // if some is not empty, then it's not valid
  sum = 0;
  if(document.getElementById("indirizzo").value != "") sum += 1;
  if(document.getElementById("cap").value != "") sum += 1;
  if(document.getElementById("citta").value != "") sum += 1;

  if(!(sum == 0 || sum == 3)) {
    document.getElementById("errorindirizzo").removeAttribute("hidden");
    return false;
  }

  if(sum == 0) return true;

  cap = document.getElementById("cap").value;

  if(cap.length != 5 || isNaN(cap)){
    document.getElementById("capinvalida").removeAttribute("hidden");
    return false;
  }
}


// This function is a portion of the function defined in js/signup.js
function verifyAddr(){
  isOk = true;
  // and the address is valid, if given
  if(!document.getElementById("errorindirizzo").hasAttribute("hidden")) isOk = false;
  if(!document.getElementById("capinvalida").hasAttribute("hidden")) isOk = false;
  if(document.getElementById("indirizzo").value == "") isOk = false;

  text = document.getElementById("indirizzo").value + ", " + document.getElementById("cap").value + ", " + document.getElementById("citta").value;

  if(text == ", , ") {
    alert("Non puoi aggiungere un indirizzo vuoto");
    return false;
  }

  let jsoncookie = {"addadr" : text};

  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  // If it's "ok" (client side), I can submit the form and pass it to the server
  if(isOk){
    $.ajax({
      url:"/php/address.php",   //the page containing php script
      type: "POST",                   //request type,
      dataType: 'JSON',
      data: (jsoncookie),
      success:function(){
        console.log("Server success");
        nextNumber = document.getElementById("indirizziDinamici").childElementCount / 2;
        // this is already "+1"

        addressesHtml = `<div class=\"verticaladdresses\" id = \"indr${nextNumber}\">${text}</div>
        <div class=\"verticalbuttons\" id=\"btnindr${nextNumber}\">
          <button class=\"littlebutton\" onclick=def_ind(${nextNumber})> Rendi default </button>
          <button class=\"deletebutton\" onclick=del_ind(${nextNumber})> Elimina </button>
        </div>\n`;
  
        document.getElementById("indirizziDinamici").innerHTML += addressesHtml;

        document.getElementById("indirizzo").value = "";
        document.getElementById("cap").value = "";
        document.getElementById("citta").value = "";

        console.log("Local sucess");
      }
    });
  }

  return isOk;
}

function def_ind(ind_n) {
  text = document.getElementById("indr" + ind_n).textContent;

  let jsoncookie = {"mkdef" : text};

  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }
  console.log(jsoncookie);

  $.ajax({
    url:"/php/address.php",   //the page containing php script
    type: "POST",             //request type,
    dataType: 'JSON',
    data: (jsoncookie),
    success:function(){
      console.log("Server success");
      def_address = document.getElementById("inddefualtdinamico").textContent;
      document.getElementById("indr" + ind_n).textContent = def_address;
      document.getElementById("inddefualtdinamico").textContent = text;
      console.log("Local success");
    }
  });
}

function del_ind(ind_n){
  text = document.getElementById("indr" + ind_n).textContent;
  let confermed = confirm("Sei sicuro di voler eliminare il seguente indirizzo?\n" + text);

  if(!confermed) return false;

  let jsoncookie = {"del" : text};

  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  $.ajax({
    url:"/php/address.php",   //the page containing php script
    type: "POST",                   //request type,
    dataType: 'JSON',
    data: (jsoncookie),
    success:function(){
      console.log("Server success");
      document.getElementById("indr" + ind_n).remove();
      document.getElementById("btnindr" + ind_n).remove();
      console.log("Local success");
    }
  });
}

function getDinamic() {
  let jsoncookie = {"dynamic" : "true"};

  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  if(!jsoncookie.hasOwnProperty("saveduser") || !jsoncookie.hasOwnProperty("iv")) window.location.replace("/account/login.html");

  $.ajax({
    url: "/php/address.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success: function(response){
      if(response["usrfound"] == 0) window.location.replace("/account/login.html");

      document.getElementById("nomedinamico").textContent = response["nome"];
      document.getElementById("inddefualtdinamico").innerHTML = response["indefault"];

      addressesHtml = "";
      for(let i = 0; i < response["indirizzi"].length; i++){
        addressesHtml += `<div class=\"verticaladdresses\" id = \"indr${i}\">${response["indirizzi"][i]}</div>
        <div class=\"verticalbuttons\" id=\"btnindr${i}\">
          <button class=\"littlebutton\" onclick=def_ind(${i})> Rendi default </button>
          <button class=\"deletebutton\" onclick=del_ind(${i})> Elimina </button>
        </div>\n`;

      }
      document.getElementById("indirizziDinamici").innerHTML = addressesHtml;
    }
  });
}

/*
function reloadAddresses(){

}*/