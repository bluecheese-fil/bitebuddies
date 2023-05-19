function loadCart(){
  if(window.outerWidth <= 770) { // small screens
    $("#iconmover").attr("name", "up");
    $("#iconmover").attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-down-line.svg");
  } else { // big screen
    $("#iconmover").attr("name", "left");
    $("#iconmover").attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-right-line.svg");
  }

  $("#rightpanel").css('visibility', 'visible');
  if($("#rightpanel").css("float") == "right") {
    $("#rightpanel").animate({'right':'0px'}); $("#iconmover").animate({'right':'45px',});
  } else {
    $("#rightpanel").animate({'bottom':'-260px'}); $("#iconmover").animate({'bottom':'45px',});
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

      text = `<option selected> ${response["indefault"]} </option>\n`;
      for(let i = 0; i < response["indirizzi"].length; i++) text += `<option> ${response["indirizzi"][i]} </option>\n`;

      $("#address").html(text);
      $("#login").attr("hidden", "true");
      $("#order").removeAttr("hidden"); $("#account").removeAttr("hidden");
      $("#rightpanel").css("cursor", "default");
    }
  });
}

function checkClock(id){
  current_clock = $("#" + id).val();
  clock_info = document.getElementById("orario").innerText.split(" - ");
  
  openhour = Number.parseInt(clock_info[0]); openminute = Number.parseInt(clock_info[0].substring(3));
  closehour = Number.parseInt(clock_info[1]); closeminute = Number.parseInt(clock_info[1].substring(3));
  
  currenthour = Number.parseInt(current_clock);
  currentminute = Number.parseInt(current_clock.substring(3));
  
  today = new Date();
  if($("#date").val() != "" && $("#date").val() == `${today.getFullYear()}-${(today.getMonth() + 1 + "").padStart(2, '0')}-${(today.getDate() + "").padStart(2, '0')}`){
    console.log(today.getHours());
    if(currenthour < today.getHours() || (currenthour == today.getHours() && currentminute < today.getMinutes())){
      alert("Non puoi impostare una consegna nel passato!");

      closestMinute = Math.ceil(today.getMinutes()/5);
      if(closestMinute == 12){ currenthour += 1; closestMinute = 0;} // moving the hour by one forward in time
      newminute = (closestMinute*5).toString(); /* Making the minutes a multiple of 5 */
      
      $("#" + id).val((today.getHours() + '').padStart(2, '0') + ':' + newminute.padStart(2, '0'));
      return ;
    }
  }

  newhour = currenthour.toString(); newminute = currentminute.toString();
  if(currenthour < openhour){
    alert("L'orario di consegna non è stato impostato correttamente. È stato spostato automaticamente al primo orario disponibile");
    newhour = openhour.toString(); newminute = openminute.toString();
  } else if(currenthour > closehour) {
    alert("L'orario di consegna non è stato impostato correttamente. È stato spostato automaticamente al primo orario disponibile");
    newhour = closehour.toString(); newminute = closeminute.toString();
  } else if(currenthour == openhour && currentminute < openminute){
    alert("L'orario di consegna non è stato impostato correttamente. È stato spostato automaticamente al primo orario disponibile");
    newminute = openminute.toString();
  } else if(currenthour == closehour && currentminute > closeminute){
    alert("L'orario di consegna non è stato impostato correttamente. È stato spostato automaticamente al primo orario disponibile");
    newminute = closeminute.toString();
  } else {
    closestMinute = Math.round(currentminute/5);
    if(closestMinute == 12){ currenthour += 1; closestMinute = 0;} // moving the hour by one forward in time
    newminute = (closestMinute*5).toString(); /* Making the minutes a multiple of 5 */
  }

  $("#" + id).val(newhour.padStart(2, '0') + ":" + newminute.padStart(2, '0'));
}

function clicked(name){
  elem = $("#iconmover");
  if(name == "left") {
    elem.attr("name", "right");
    $("#rightpanel").animate({'right':'-350px'});
    $("#restaurant").animate({'left':'270px'});
    elem.attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-left-line.svg");
  } else if(name == "right") {
    elem.attr("name", "left");
    $("#rightpanel").animate({'right': '0%'});
    $("#restaurant").animate({'left': '0px'});
    elem.attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-right-line.svg");
  } else if(name == "up") {
    elem.attr("name", "down");
    $("#rightpanel").animate({'bottom':'-650px'});
    $("#iconmover").attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-up-line.svg");
  } else { // if name == "down"
    elem.attr("name", "up");
    $("#rightpanel").animate({'bottom':'-260px'});
    $("#iconmover").attr("src", "https://cdn.jsdelivr.net/npm/remixicon@3.3.0/icons/Arrows/skip-down-line.svg");
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

  console.log(delivery);
  console.log($("#takeaway").css("opacity"));
  console.log($("#takeaway").css("opacity") == 1);
  console.log(Number.parseFloat($("#delivery2").text()));
  

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
  jsoncookie["id"] = id;
  
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
  jsoncookie["id"] = id;
  
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
                  <a id="name" class="menuname"> ${instance["oggetto"]} </a>
                  <a id="price" class="price"> ${instance["prezzo"]}€ </a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlAntipasti += `<a id="ing1" class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlAntipasti += `<a id="ing1" class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente2"] != null) htmlAntipasti += `<a id="ing1" class="ingredient"> · ${instance["ingrediente3"]} </a>`;

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
          
            if(instance["ingrediente1"] != null) htmlBibite += `<a id="ing1" class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlBibite += `<a id="ing1" class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente2"] != null) htmlBibite += `<a id="ing1" class="ingredient"> · ${instance["ingrediente3"]} </a>`;

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
                  <a id="name" class="menuname"> ${instance["oggetto"]} </a>
                  <a id="price" class="price"> ${instance["prezzo"]}€ </a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlDolci += `<a id="ing1" class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlDolci += `<a id="ing1" class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente2"] != null) htmlDolci += `<a id="ing1" class="ingredient"> · ${instance["ingrediente3"]} </a>`;

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
                  <a id="name" class="menuname"> ${instance["oggetto"]} </a>
                  <a id="price" class="price"> ${instance["prezzo"]}€ </a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlPrimi += `<a id="ing1" class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlPrimi += `<a id="ing1" class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente2"] != null) htmlPrimi += `<a id="ing1" class="ingredient"> · ${instance["ingrediente3"]} </a>`;

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
                  <a id="name" class="menuname"> ${instance["oggetto"]} </a>
                  <a id="price" class="price"> ${instance["prezzo"]}€ </a>
                </div>
                <div>`;
          
            if(instance["ingrediente1"] != null) htmlSecondi += `<a id="ing1" class="ingredient"> ${instance["ingrediente1"]} </a>`;
            if(instance["ingrediente2"] != null) htmlSecondi += `<a id="ing1" class="ingredient"> · ${instance["ingrediente2"]} </a>`;
            if(instance["ingrediente2"] != null) htmlSecondi += `<a id="ing1" class="ingredient"> · ${instance["ingrediente3"]} </a>`;

            htmlSecondi += `</div>
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

      $("#menu").html(htmlAntipasti + htmlPrimi + htmlSecondi + htmlDolci + htmlBibite);
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