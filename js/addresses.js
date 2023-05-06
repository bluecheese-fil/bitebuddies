function checkInd(){
  $("#errorindirizzo").attr("hidden", true);
  $("#capinvalida").attr("hidden", true);

  // if some is not empty, then it's not valid
  sum = 0;
  if($("#indirizzo").val() != "") sum += 1;
  if($("#cap").val() != "") sum += 1;
  if($("#citta").val() != "") sum += 1;

  if(!(sum == 0 || sum == 3)) {
    $("#errorindirizzo").removeAttr("hidden");
    return false;
  }

  if(sum == 0) return true;

  cap = $("#cap").val();

  if(cap.length != 5 || isNaN(cap)){
    $("#capinvalida").removeAttr("hidden");
    return false;
  }
}


// This function is a portion of the function defined in js/signup.js
function verifyAddr(){
  isOk = true;
  // and the address is valid, if given
  if(!document.getElementById("errorindirizzo").hasAttribute("hidden")) isOk = false;
  if(!document.getElementById("capinvalida").hasAttribute("hidden")) isOk = false;
  if($("#indirizzo").val() == "") isOk = false;

  indr = $("#indirizzo").val();
  cap = $("#cap").val();
  city = $("#citta").val();

  if(indr == "" && cap == "" && city == "") {
    alert("Non puoi aggiungere un indirizzo vuoto");
    return false;
  }

  let jsoncookie = {"addadr" : "true", "addr" : indr, "cap" : cap, "city" : city};

  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  // If it's "ok" (client side), I can submit the form and pass it to the server
  if(isOk){
    $.ajax({
      url:"/php/addresses.php",   //the page containing php script
      type: "POST",                   //request type,
      dataType: 'JSON',
      data: (jsoncookie),
      success:function(response){
        if(response["error"] == 1) {
          console.log("Server error");
          if(response["address"] == "incomplete") $("#errorindirizzo").removeAttr("hidden");
          else if(response["cap"] == "incomplete") $("#capinvalida").removeAttr("hidden");
          else if(response["exists"] == "true") alert("Non è possibile inserire più volte lo stesso indirizzo.")
          console.log("Local sucess")
          return ;
        }
        
        console.log("Server success");
        nextNumber = document.getElementById("indirizziDinamici").childElementCount; // this is already "+1"

        addressesHtml = `
        <div id="totalindr${nextNumber}" class="addrdiv">
        <div class=\"verticaladdresses\" id = \"indr${nextNumber}\">${response["finaladdr"]}</div>
        <div class=\"verticalbuttons\" id=\"btnindr${nextNumber}\">
          <button class=\"littlebutton\" onclick=def_ind(${nextNumber})> Rendi default </button>
          <button class=\"deletebutton\" onclick=del_ind(${nextNumber})> Elimina </button>
        </div>\n`;
        
        document.getElementById("indirizziDinamici").innerHTML += addressesHtml;
        $("#indirizzo").val(""); $("#cap").val(""); $("#citta").val("");

        if(nextNumber > 0) $(`#totalindr${nextNumber - 1}`).css("margin-bottom", 0);
        $(`#totalindr${nextNumber}`).css("margin-bottom", 50);

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
    url:"/php/addresses.php",   //the page containing php script
    type: "POST",             //request type,
    dataType: 'JSON',
    data: (jsoncookie),
    success:function(){
      console.log("Server success");
      def_address = $("#inddefualtdinamico").text();
      document.getElementById("indr" + ind_n).textContent = def_address;
      $("#inddefualtdinamico").text(text);
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
    url:"/php/addresses.php",   //the page containing php script
    type: "POST",                   //request type,
    dataType: 'JSON',
    data: (jsoncookie),
    success:function(){
      console.log("Server success");
      $("#totalindr" + ind_n).remove();

      if(ind_n > 0) $(`#totalindr${ind_n - 1}`).css("margin-bottom", 50);
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
    url: "/php/addresses.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success: function(response){
      if(response["usrfound"] == 0) window.location.replace("/account/login.html");

      $("#nomedinamico").text("Ciao " + response["nome"]);
      $("#inddefualtdinamico").html(response["indefault"]);

      addressesHtml = "";
      for(let i = 0; i < response["indirizzi"].length; i++){
        addressesHtml += `
        <div id="totalindr${i}" class="addrdiv">
          <div class=\"verticaladdresses\" id = \"indr${i}\">${response["indirizzi"][i]}</div>
          <div class=\"verticalbuttons\" id=\"btnindr${i}\">
            <button class=\"littlebutton\" onclick=def_ind(${i})> Rendi default </button>
            <button class=\"deletebutton\" onclick=del_ind(${i})> Elimina </button>
          </div>
        </div>\n`;

      }

      $("#indirizziDinamici").html(addressesHtml);
      $(`#totalindr${response["indirizzi"].length - 1}`).css("margin-bottom", 50);
    }
  });
}