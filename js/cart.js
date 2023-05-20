function loadCart(){
  $("#rightpanel").css('visibility', 'visible');
  if(window.outerWidth <= 770) { // small screens
    $("#iconmover").remove();
  } else { // big screen
    $("#iconmover").attr("name", "left");
    $("#iconmover").attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-right-line.svg");
    $("#rightpanel").animate({'right':'0px'}); $("#iconmover").animate({'right':'45px',});
  }

  today = new Date();
  max = new Date(today); max.setDate(max.getDate() + 7);

  $("#date").attr("min", `${today.getFullYear()}-${(today.getMonth() + 1 + "").padStart(2, '0')}-${(today.getDate() + "").padStart(2, '0')}`);
  $("#date").attr("max", `${max.getFullYear()}-${(max.getMonth() + 1 + "").padStart(2, '0')}-${(max.getDate() + "").padStart(2, '0')}`);

  jsoncookie = {"dynamic" : "true"};
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  if(jsoncookie["iv"] == null || jsoncookie["saveduser"] == null) {
    $("#rightpanel").css("cursor", "default"); $("#order").remove(); $("#account").remove();
    return ;
  }

  $.ajax({
    url: "/php/addresses.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success: function(response){
      if(response["usrfound"] == 0) {
        quitUser();

        choice = confirm("È presente un errore nell'utente memorizzato. Vuole rifare il login?");
        if(choice) window.location.replace("/account/login.html");
        
        $("#rightpanel").css("cursor", "default");
        $("#order").remove(); $("#account").remove();
      }

      $("#nomedinamico").text(response["nome"]);

      text = `<option value="${response["indefault"]}" selected> ${response["indefault"]} </option>\n`;
      for(let i = 0; i < response["indirizzi"].length; i++) text += `<option value="${response["indirizzi"][i]}"> ${response["indirizzi"][i]} </option>\n`;

      $("#address").html(text);
      $("#login").attr("hidden", "true");
      $("#order").removeAttr("hidden"); $("#account").removeAttr("hidden");
      $("#rightpanel").css("cursor", "default");

      resizeCart();
    }
  });
}

function resizeCart(duration = 0){
  // calculating cart size
  if(window.outerWidth <= 770) { // small screens
    $("#chosenitems").animate({"max-height":($(".cartinfo").height() - 110) + "px"}, duration);
  } else { // big screen
    cartHeight = $("#rightpanel").height() - $(".cartinfo").offset()["top"] - $(".cartinfo").height() - $(".paymentinfo").height() - $(".costgrid").height() - 110; //110 pixels between restaurant name, margins, hr and some spacing for padding
    $("#chosenitems").animate({"max-height":cartHeight + "px"}, duration);
  }
}

function lowerboundClock(){
  lowerbound = '';

  today = new Date();
  if($("#date").val() != "" && $("#date").val() == `${today.getFullYear()}-${(today.getMonth() + 1 + "").padStart(2, '0')}-${(today.getDate() + "").padStart(2, '0')}`){
    if(currenthour < today.getHours() || (currenthour == today.getHours() && currentminute < today.getMinutes())){
      toAlert = "Non puoi impostare una consegna nel passato!";

      closestMinute = Math.ceil(today.getMinutes()/5);
      if(closestMinute == 12){ currenthour += 1; closestMinute = 0;} // moving the hour by one forward in time
      newminute = (closestMinute*5).toString(); /* Making the minutes a multiple of 5 */
      
      lowerbound = (today.getHours() + '').padStart(2, '0') + ':' + newminute.padStart(2, '0')
    }
  }

  return lowerbound;
}

function checkClock(id){
  current_clock = $("#" + id).val();
  clock_info = document.getElementById("orario").innerText.split(" - ");
  
  openhour = Number.parseInt(clock_info[0]); openminute = Number.parseInt(clock_info[0].substring(3));
  closehour = Number.parseInt(clock_info[1]); closeminute = Number.parseInt(clock_info[1].substring(3));
  
  currenthour = Number.parseInt(current_clock);
  currentminute = Number.parseInt(current_clock.substring(3));

  lowerbound = lowerboundClock();
  lowerhour = Number.parseInt(lowerbound); lowerminue = Number.parseInt(lowerbound.substring(3));

  newhour = currenthour.toString(); newminute = currentminute.toString();

  // This checks if the clock was set before the opening hour or the current real time hour
  changed = false;
  if(currenthour < openhour){
    if(lowerhour > openhour) newhour = lowerhour.toString();
    else newhour = openhour.toString();
    newminute = openminute.toString();

    changed = true;

  } else if(currenthour == openhour && currentminute < openminute) {
    if(lowerminue > openminute) newminute = lowerminue.toString();
    else newminute = openminute.toString();

    changed = true;
  }

  // This checks if the clock was set after the closing hour or before the current real time hour
  if(currenthour > closehour || (currenthour == closehour && currentminute > closeminute)) {

    // I have to select the first hour on the next day
    if(lowerbound > closehour) {
      tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      $("#date").val(tomorrow.getFullYear());

      newhour = openhour.toString(); newminute = openminute.toString();
      alert("La data e l'orario sono stati cambiati in accordo con gli orari di apertura del ristorante");

      $("#orario").animate({"color":"red"}, 500);
      $("#time").animate({"color":"red"}, 500);
      $("#date").animate({"color":"red"}, 500);
      $("#orario").animate({"color":"black"}, 500);
      $("#time").animate({"color":"black"}, 500);
      $("#date").animate({"color":"black"}, 500);

    } else { newhour = closehour.toString(); newminute = closeminute.toString(); }

    changed = true;
  }

  // This now makes the minutes a multiple of 5
  closestMinute = Math.round(newminute/5);
  if(closestMinute == 12){ newhour += 1; newminute = 0;} // moving the hour by one forward in time
  newminute = (closestMinute*5).toString(); /* Making the minutes a multiple of 5 */

  $("#" + id).val(newhour.padStart(2, '0') + ":" + newminute.padStart(2, '0'));

  if(changed) {
    alert("Attenzione! L'orario e' stato cambiato in accordo con gli orari di apertura del ristorante");
    $("#orario").animate({"color":"red"}, 500);
    $("#time").animate({"color":"red"}, 500);
    $("#orario").animate({"color":"black"}, 500);
    $("#time").animate({"color":"black"}, 500);
  }
}

function clicked(name){
  elem = $("#iconmover");
  if(name == "left") {
    elem.attr("name", "right");
    $("#rightpanel").animate({'right':'-350px'});
    $("#restaurant").animate({'width' : `${Number.parseFloat($("#restaurant").css("width")) + 350}px`});
    elem.attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-left-line.svg");
  } else if(name == "right") {
    elem.attr("name", "left");
    $("#restaurant").animate({'width' : `${Number.parseFloat($("#restaurant").css("width")) - 350}px`});
    $("#rightpanel").animate({'right': '0%'});
    elem.attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-right-line.svg");
  }

  if($("#addaddress").css("opacity") == "1"){
    $("#addaddress").css("visibility", "hidden");
    $("#addaddress").css("display", "none");
    $("#addimage").css("transform", "rotate(0deg)");
    $("#addimage").css("border-spacing", "0px");
    $("#addimage").attr("name", "invisible");
    $("#addimage").attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/System/add-box-fill.svg");
  
    $("#indirizzo").val(""); $("#cap").val(""); $("#citta").val("");
    $("#errorindirizzo").attr("hidden", true); $("#capinvalida").attr("hidden", true);
  }
}

function switchaddr(name){
  if(name == "visible"){
    $('#addimage').animate({  borderSpacing: 0 }, {
      step: function(now,fx) {
        $(this).css('-webkit-transform','rotate('+now+'deg)'); 
        $(this).css('-moz-transform','rotate('+now+'deg)');
        $(this).css('transform','rotate('+now+'deg)');
      }, duration: 550});

    $("#addaddress").animate({"opacity":"0"});
    // I need to check wheter to move "down" the element
    if($("#rightpanel").css("float") != "right") $("#rightpanel").animate({'bottom':'-260px'});
    $("#addaddress").css("visibility", "hidden");
    $("#addaddress").css("display", "none");

    $("#errorindirizzo").attr("hidden", true); $("#capinvalida").attr("hidden", true);

    $("#addimage").attr("name", "invisible");
    $("#addimage").attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/System/add-box-fill.svg");
  } else { // invisible
    $('#addimage').animate({  borderSpacing: 180 }, {
      step: function(now,fx) {
        $(this).css('-webkit-transform','rotate('+now+'deg)'); 
        $(this).css('-moz-transform','rotate('+now+'deg)');
        $(this).css('transform','rotate('+now+'deg)');
      }, duration: 550});
    
    $("#addaddress").css("visibility", "visible");
    $("#addaddress").css("display", "flex");
    $("#addaddress").animate({"opacity":"1"});

    // I need to check wheter to move "up" the element
    if($("#rightpanel").css("float") != "right") $("#rightpanel").animate({'bottom':'0px'});
    
    $("#addimage").attr("name", "visible");
    $("#addimage").attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/System/checkbox-indeterminate-fill.svg");
  
    $("#indirizzo").val(""); $("#cap").val(""); $("#citta").val("");
  }

  // after chaning the size of something, I need to resize the cart too
  resizeCart(400);
}
  
function customCallback(address){
  addressHtml = `<option selected>${address}</option>\n`;

  // Removing the default address
  childrenCollection = document.getElementById("address").children;
  for(i = 0; i < childrenCollection.length; i++){
    if(childrenCollection.selected) {childrenCollection.selected = false; break; }
  }
  
  document.getElementById("address").innerHTML += addressHtml;

  $("#indirizzo").val(""); $("#cap").val(""); $("#citta").val("");
  switchaddr("visible");

  // Making the child flash red to make sure the user noticed the address was changed
  $("#address").animate({"color":"white", "backgroundColor":"black"}, 125);
  $("#address").animate({"color":"black", "backgroundColor":"white"}, 125);
  $("#address").animate({"color":"white", "backgroundColor":"black"}, 125);
  $("#address").animate({"color":"black", "backgroundColor":"white"}, 125);
}

function addToCart(ristid, name, price){
  try { order = JSON.parse(localStorage.getItem("order")); }
  catch (error) { order = {"restaurant" : ristid, "restname" : $("#title").text()}; } // if error in item and it's nor parsable
  if(order == null) order = {"restaurant" : ristid, "restname" : $("#title").text()};

  if(order != undefined && order["restaurant"] != ristid) {
    ok = confirm("Hai gia' il carrello salvato per un altro ristorante, vuoi eliminarlo?");
    if(!ok) return ;
    order = {"restaurant" : ristid, "restname" : $("#title").text()};
  }

  $("#chosenrestaurant").text(order["restname"]);
  if(order[name] == undefined) order[name] = [1, price];
  else order[name][0] += 1;

  localStorage.setItem("order", JSON.stringify(order));
  updatecart();
}

function increase(name){
  order = JSON.parse(localStorage.getItem("order"));

  $("#subtotal").text(Number.parseFloat($("#subtotal").text()) + order[name][1]);
  $("#total").text(Number.parseFloat($("#delivery2").text()) + Number.parseFloat($("#subtotal").text()));

  document.getElementById(name+"amount").text = name + " : " + ++order[name][0];
  localStorage.setItem("order", JSON.stringify(order));
}

function decrease(name){
  order = JSON.parse(localStorage.getItem("order"));
  value = --order[name][0];
  
  if(value == 0) remove(name);
  else {
    $("#subtotal").text(Number.parseFloat($("#subtotal").text()) - order[name][1]);
    $("#total").text(Number.parseFloat($("#delivery2").text()) + Number.parseFloat($("#subtotal").text()));    document.getElementById(name+"amount").text = name + " : " + value;
    localStorage.setItem("order", JSON.stringify(order));
  }
}

function remove(name){
  document.getElementById(name).remove();
  order = JSON.parse(localStorage.getItem("order"));

  $("#subtotal").text(Number.parseFloat($("#subtotal").text()) - order[name][1]*order[name][0]);

  $("#total").text(Number.parseFloat($("#delivery2").text()) + Number.parseFloat($("#subtotal").text()));

  delete order[name];
  // If there's no more orders, I don't have to pay for delivery
  if(Object.keys(order).length == 2) $("#total").text(Number.parseFloat($("#total").text()) - Number.parseFloat($("#delivery2").text()));


  if (Number.parseFloat($("#subtotal").text()) == 0){
    $("#chosenrestaurant").text('');
    localStorage.removeItem("order");
  } else localStorage.setItem("order", JSON.stringify(order));
}

function updatecart(){
  try { order = JSON.parse(localStorage.getItem("order")); }
  catch (error) { return ; } // if error in item and it's nor parsable
  if(order == null) return ;

  html = '';
  total = 0;

  $("#chosenrestaurant").text(order["restname"])
  for(const key in order){
    if(key == "restaurant" || key == "restname") continue;

    total += order[key][0]*order[key][1];

    html += `
      <div id="${key}" class="cartchosen">
        <a id="${key}amount" class="textchosen"> ${key} : ${order[key][0]} </a>
        <div>
          <img onclick="increase('${key}')" style="width: 20px; height: 20px" src="https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/System/add-fill.svg">
          <img onclick="decrease('${key}')" style="width: 20px; height: 20px" src="https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/System/subtract-fill.svg">
          <img onclick="remove('${key}')" style="width: 20px; height: 20px" src="https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/System/delete-bin-2-fill.svg">
        </div>
      </div>
    `;
  }

  $("#chosenitems").html(html);
  $("#subtotal").text(total);

  delivery = Number.parseFloat($("#delivery2").text());
  if($("#takeaway").css("opacity") != 0.4) delivery = 0;
  else delivery = Number.parseFloat($("#delivery2").text());

  $("#total").text( delivery + Number.parseFloat($("#subtotal").text()));
}

function resizeMenu(){
  // after the picture is loaded, I can get the info height
  infoheight = Number.parseFloat($("#info").css("height")) + 20; //20px of margin
  rightdivheight =  Number.parseFloat($("#rightpanel").css("height"));
  $("#restaurant").css("height", rightdivheight+"px");

  infoperc = Math.ceil((infoheight + 25) * 100 / rightdivheight); // I'm giving 25px of margin flat
  $("#menu").css("height", `${100 - infoperc}%`);
}

function loadRestaurant(id){
  if(window.outerWidth > 770) /* big screens */ $("#restaurant").css("width", `${window.innerWidth - 450}px`);

  let jsoncookie = {"ristoranti" : "true"};
  jsoncookie["restid"] = id;
  
  $.ajax({
    url: "/php/menu.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success:function(response) {
      instance = response["info"];

      $("#image").attr('src', `/images/ristoranti/${instance["immagine"]}.jpg`); $("#image").removeAttr('hidden')
      $("#title").text(instance["nome"]);
      $("#info").html(
        `
        <h4>${instance["categoria"]}</h4> <h4>${instance["descrizione"]}</h4>
        <h4> <img src="/images/static/posizione.png" width="30px" height="30px">${instance["indirizzo"]} </h4>
        <h4> <img src="/images/static/consegna.png" width="30px" height="30px"> Consegna: ${instance["costo_consegna"]}€ </h4>
        <h4 style="display: flex;" id="orario"> ${instance["orapertura"]} - ${instance["orachiusura"]} <img src="https://cdn.jsdelivr.net/npm/remixicon@3.1.1/icons/System/time-line.svg" height="30px"> </h4>
        <div class="reviewvs">
          <div style="display: flex">
            <img src="/images/static/star.png" class="voto">
            <h4>${instance["voto"]}</h4>
          </div>
          <div class="pictureddiv" >
            <div id="colored_circle" class="circle"> </div>
            <div id="euro" style="font-size: x-large; font-weight: 600;">${instance["prezzo"]}</div>
          </div>
        </div>`
      )

      $("#delivery2").text(instance["costo_consegna"]);
      
      cost = instance["prezzo"].length;
      if(cost == 1) $("#colored_circle").animate({backgroundColor:"green"}, 400);
      else if(cost == 2) $("#colored_circle").animate({backgroundColor:"yellow"}, 400);
      else if(cost == 3) $("#colored_circle").animate({backgroundColor:"red"}, 400);
      // once everything for the restaurant is loaded, I can load the saved order
      updatecart()
    }
  });
}

function loadFood(id){
  let jsoncookie = {"menu" : "true"};
  jsoncookie["restid"] = id;
  
  $.ajax({
    url: "/php/menu.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success:function(response) {

      htmlAntipasti = '';
      htmlBibite = '';
      htmlDolci = '';
      htmlPrimi = '';
      htmlSecondi = '';
      htmlSandwich = '';
      htmlPizze = '';
      htmlColazione = '';
      htmlKebab = '';
      htmlFrutta = '';

      for (index = 0; index < response["menu"].length; index++) {
        instance = response["menu"][index];

        if(instance["categoria"] == "Antipasti"){
          if(htmlAntipasti.length == 0) htmlAntipasti += `
            <div class='sectionbreak'> Antipasti </div>
            <div id="menuitems" class="menuitems">
            `;

          htmlAntipasti += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlAntipasti += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlAntipasti += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlAntipasti += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlAntipasti += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;
        } else if(instance["categoria"] == "Bibite"){
          if(htmlBibite.length == 0) htmlBibite += `
            <div class='sectionbreak'> Bibite </div>
            <div id="menuitems" class="menuitems">
            `;
          
            htmlBibite += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname"> ${instance["oggetto"]} </a>
                  <a id="price" class="price"> ${instance["prezzo"]}€ </a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlBibite += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlBibite += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlBibite += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlBibite += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;

        } else if(instance["categoria"] == "Dolci"){
          if(htmlDolci.length == 0) htmlDolci += `
            <div class='sectionbreak'> Dolci </div>
            <div id="menuitems" class="menuitems">
            `;

            htmlDolci += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlDolci += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlDolci += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlDolci += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlDolci += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;

        } else if(instance["categoria"] == "Primi"){
          if(htmlPrimi.length == 0) htmlPrimi += `
            <div class='sectionbreak'> Primi </div>
            <div id="menuitems" class="menuitems">
            `;
          
            htmlPrimi += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlPrimi += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlPrimi += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlPrimi += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlPrimi += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;

        } else if(instance["categoria"] == "Secondi"){
          if(htmlSecondi.length == 0) htmlSecondi += `
            <div class='sectionbreak'> Secondi </div>
            <div id="menuitems" class="menuitems">
            `;

            htmlSecondi += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlSecondi += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlSecondi += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlSecondi += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlSecondi += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;

        } else if(instance["categoria"] == "Sandwich"){
          if(htmlSandwich.length == 0) htmlSandwich += `
            <div class='sectionbreak'> Sandwich </div>
            <div id="menuitems" class="menuitems">
            `;

            htmlSandwich += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlSandwich += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlSandwich += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlSandwich += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlSandwich += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;

        } else if(instance["categoria"] == "Pizze"){
          if(htmlPizze.length == 0) htmlPizze += `
            <div class='sectionbreak'> Pizze </div>
            <div id="menuitems" class="menuitems">
            `;

            htmlPizze += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlPizze += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlPizze += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlPizze += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlPizze += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;

        } else if(instance["categoria"] == "Colazione"){
          if(htmlColazione.length == 0) htmlColazione += `
            <div class='sectionbreak'> Colazione </div>
            <div id="menuitems" class="menuitems">
            `;

            htmlColazione += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlColazione += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlColazione += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlColazione += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlColazione += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;

        } else if(instance["categoria"] == "Kebab"){
          if(htmlKebab.length == 0) htmlKebab += `
            <div class='sectionbreak'> Kebab </div>
            <div id="menuitems" class="menuitems">
            `;

            htmlKebab += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlKebab += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlKebab += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlKebab += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlKebab += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;

        } else if(instance["categoria"] == "Frutta"){
          if(htmlFrutta.length == 0) htmlFrutta += `
            <div class='sectionbreak'> Frutta </div>
            <div id="menuitems" class="menuitems">
            `;

            htmlFrutta += `
            <div name="${instance["oggetto"]}" style="width: fit-content;">
              <div class="menuitem">
                <div class="pricedname">
                  <a id="name" class="menuname">${instance["oggetto"]}</a>
                  <a id="price" class="price">${instance["prezzo"]}€</a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlFrutta += `<a class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlFrutta += `<a class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente3"] != null) htmlFrutta += `<a class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlFrutta += `</div>
              <button onclick="addToCart(${id}, '${instance["oggetto"]}', ${instance["prezzo"]})"> Aggiungi al carrello  <img src="/images/static/carrello.png" width="25px" height="25px"> </button>
            </div>
          </div>
          `;
        }
      }

      if(htmlAntipasti.length != 0) htmlAntipasti += '</div></div>';
      if(htmlBibite.length != 0) htmlBibite += '</div></div>';
      if(htmlDolci.length != 0) htmlDolci += '</div></div>';
      if(htmlPrimi.length != 0) htmlPrimi += '</div></div>';
      if(htmlSecondi.length != 0) htmlSecondi += '</div></div>';
      if(htmlSandwich.length != 0) htmlSandwich += '</div></div>';
      if(htmlPizze.length != 0) htmlPizze += '</div></div>';
      if(htmlColazione.length != 0) htmlColazione += '</div></div>';
      if(htmlKebab.length != 0) htmlKebab += '</div></div>';
      if(htmlFrutta.length != 0) htmlFrutta += '</div></div>';

      $("#menu").html(htmlColazione + htmlAntipasti + htmlSandwich + htmlPrimi + htmlPizze + htmlSecondi + htmlKebab + htmlDolci + htmlBibite + htmlFrutta);
    }
  });
}

function takeaway(id){
  value = $("#"+id).attr("value");

  if(value == "false"){
    if($("#addimage").attr("name") == "visible") $("#addimage").click();

    $("#addimage").attr("onclick", "");
    $("#chosenaddress").animate({opacity : 0.4});
    $("#"+id).animate({opacity : 1});

    $("#delivery1").animate({'opacity': 0.4}); $("#delivery2").animate({'opacity': 0.4}); $("#delivery3").animate({'opacity': 0.4});
    
    // if subtotal cost is not zero, i'm buying something! I need to remove the delivery cost
    if(Number.parseInt($("#subtotal").text()) != 0) $("#total").text(Number.parseFloat($("#total").text()) - Number.parseFloat($("#delivery2").text()));

    value = $("#"+id).attr("value", "true");
  } else {
    $("#chosenaddress").animate({opacity : 1});
    $("#"+id).animate({opacity : 0.4});
    $("#addimage").attr("onclick", "switchaddr(this.name)");
    
    $("#delivery1").animate({'opacity': 1}); $("#delivery2").animate({'opacity': 1}); $("#delivery3").animate({'opacity': 1});

    // if subtotal cost is not zero, i'm buying something! I need to ADD the delivery cost
    if(Number.parseInt($("#subtotal").text()) != 0) $("#total").text(Number.parseFloat($("#total").text()) + Number.parseFloat($("#delivery2").text()));

    value = $("#"+id).attr("value", "false");
  }
}

function confirmOrder(){
  ok = confirm("Vuoi confermare l'ordine?");
  if(!ok) return ;

  jsoncookie = {"placeOrder":"true"};
  // I now need to answer the three following basic questions: who, when, where and what (and how much)
  
  // WHO (User side)
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  // WHO (Restaurant side)
  url = new URL(window.location.href);
  id = url.searchParams.get('id');
  jsoncookie["restid"] = id;

  if(Object.keys(jsoncookie).length != 4) { window.location.replace("/500.html"); return ; }

  // WHEN
  date = $("#date").val();
  time = $("#time").val();

  if(date == "" || time == "") {alert("Devi scegliere una data ed un orario prima di poter ordinare!"); return ;}
  jsoncookie["date"] = date;
  jsoncookie["time"] = time;

  // WHAT
  items = document.getElementById("chosenitems").children;
  if(items.length == 0){ alert("Non e' possibile creare un ordine vuoto!"); return ;}

  selecteditems = [];

  for(i = 0; i < items.length; i++){
    item = items[i].children[0].text.split(" : ");
    itemname = item[0]; itemqt = item[1];

    selecteditems.push([itemname, itemqt]);
  }

  jsoncookie["selecteditems"] = selecteditems;

  // WHERE
  if($("#takeaway").css("opacity") == 1) jsoncookie["where"] = "takeaway";
  else jsoncookie["where"] = document.getElementById("address").value;

  // HOW MUCH
  jsoncookie["total"] = $("#total").text();

  $.ajax({
    url: "/php/order.php",
    type: "POST",
    data: (jsoncookie),
    success:function(response) {
      console.log("Server success");
      localStorage.removeItem("order");
      console.log("Local success");
      alert("Ordine inserito con successo, verrai automaticamente reindirizzato allo storico degli ordini");
      location.assign("/account/orderhistory.html");
    },
    error:function(response){
      console.log("Server error");
      
      if(response["usrfound"] == "0") {
        alert("Non e' possibile fare un ordine senza aver fatto il login!");
        console.log("Local success");
        return;
      }

      alert("A causa di un errore, il suo ordine non e' stato processato correttamente...");
      if(response["errortype"] = "unmatcheditems") alert("... In particolare sembra che alcuni prodotti nel suo ordine non siano venduti dal ristorante. La preghiamo di ricaricare la pagina, altrimenti contattare un amministratore del sito");
      else if(response["errortype"] == "unmatchedprice") alert("... In particolare sembra che il prezzo visualizzato non corrisponda con il ristorante. La preghiamo di ricaricare la pagina, altrimenti contattare un amministratore del sito");
      console.log("Local success");
    }
  });
}