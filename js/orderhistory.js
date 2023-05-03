function loadDynamic(){
  let jsoncookie = {"getNameNOrders" : "true"};

  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  if(!jsoncookie.hasOwnProperty("saveduser") || !jsoncookie.hasOwnProperty("iv")) window.location.replace("/account/login.html");

  $.ajax({
    url: "/php/orderhistory.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success:function(response){
      if(response["usrfound"] == 0) window.location.replace("/account/login.html");

      document.getElementById("nomedinamico").textContent = response["name"];

      if(response["orders"] == "none") document.getElementById("orderdiv").remove();
      else {
        orders = response["orders"];

        let totalHeight = document.getElementById("orderdiv").offsetHeight - 2*document.querySelector(".updown_button").offsetHeight;
        document.getElementById("dynamicorders").style.height = totalHeight + "px";
        document.getElementById("currentorder").style.marginTop = (document.querySelector(".updown_button").offsetHeight - 0.2) + "px";
        document.getElementById("currentorder").style.marginBottom = document.querySelector(".updown_button").offsetHeight + "px";
        document.getElementById("currentorder").style.height = (totalHeight + 0.2) + "px";

        for(let i = 0; i < Math.floor(orders.length / 5); i += 1){
        pages[i] = `
          <div class="leftorder_element" id = "page` + i + `-0" onclick="getOrder('page` + i + `-0', '` + orders[i*5][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5][0] + `</div>
            <div id="date_order1" class="leftorder_info"> ` + orders[i*5][1] + `</div>
          </div>
          <div class="leftorder_element" id = "page` + i + `-1" onclick="getOrder('page` + i + `-1', '` + orders[i*5 + 1][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5 + 1][0] + `</div>
            <div id="date_order1" class="leftorder_info"> ` + orders[i*5 + 1][1] + `</div>
          </div>
          <div class="leftorder_element" id = "page` + i + `-2" onclick="getOrder('page` + i + `-2', '` + orders[i*5 + 2][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5 + 2][0] + `</div>
            <div id="date_order1" class="leftorder_info"> ` + orders[i*5 + 2][1] + `</div>
          </div>
            <div class="leftorder_element" id = "page` + i + `-3" onclick="getOrder('page` + i + `-3', '` + orders[i*5 + 3][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5 + 3][0] + `</div>
          <div id="date_order1" class="leftorder_info"> ` + orders[i*5 + 3][1] + `</div>
          </div>
            <div class="leftorder_element" style="border-bottom-width: 3px" id = "page` + i + `-4" onclick="getOrder('page` + i + `-4', '` + orders[i*5 + 4][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5 + 4][0] + `</div>
            <div id="date_order1" class="leftorder_info"> ` + orders[i*5 + 4][1] + `</div>
          </div>
          `;
        }

        last = pages.length;
        pages[last] = '';
        let page = Math.floor(orders.length / 5) * 5;
        for(let i = page; i < orders.length; i++){
          pages[last] += `
            <div class="leftorder_element"`;
            
            // if it's the last one, I add the bottom border
            if(i == orders.length - 1) pages[last] += "style = \"border-bottom-width: 3px\"";
            
            pages[last] += `id="page` + page + `-` + i + `" onclick="getOrder('page` + page + `-` + i +`', '` + orders[i][0] + `')">
              <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
              <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i][0] + `</div>
              <div id="date_order1" class="leftorder_info"> ` + orders[i][1] + `</div>
            </div>
          `;
        }

        if(pages[last] == '') pages[last] = null; // deleting pages[last] if the orders are a multiple of 5
        else {
          // adding a bottom item that i will need to add the borderright
          for(let i = 0; i <= orders.length % 5; i++) pages[last] += "<div class=\"empty_element\"> </div>";
        }

        document.getElementById("noorders").remove();
        document.getElementById("dynamicorders").innerHTML = pages[currentPage];
        document.getElementById("upbt").style.opacity = 0.3;
        document.getElementById("orderdiv").style.opacity = 1;
      }

      document.getElementById("currentorder").style.borderLeftWidth = "0px";

      // After all of this, I can call the getOrder method for the first element
      getOrder("page0-0", orders[0][0]);
    }
  });
}

function getOrder(id, order_id){
  if(("ID Ordine: " + order_id) == document.getElementById("idspan").textContent) return ;

  for(let i = 0; i < document.getElementById("dynamicorders").childElementCount; i++) document.getElementById("dynamicorders").children[i].style.cursor = "pointer";
  document.getElementById(id).style.cursor = "progress";
  document.getElementById("currentorder").style.cursor = "progress";

  let jsoncookie = {"getOrder" : "true"};
  jsoncookie["order_id"] = order_id;

  $.ajax({
    url: "/php/orderhistory.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success:function(response){
      document.getElementById("nomerist").innerHTML = response["name"];
      document.getElementById("idspan").textContent = "ID Ordine: " + order_id;
      document.getElementById("consegna").textContent = "Consegnato il " + response["data"] + " alle " + response["delivery"];

      // Re-add the borderRightWidth to all the elements, I don't want to "remember" which one was
      let orders = document.getElementById("dynamicorders");
      for(let i = 0; i < orders.childElementCount; i++) orders.children[i].style.borderRightWidth = "3px";
      document.getElementById("currentorder").style.cursor = "initial";
      try {
        document.getElementById(id).style.cursor = "initial";
        document.getElementById(id).style.borderRightWidth = "0px";
      } catch(TypeError) { console.log("Moved out of the way, I can just close this."); }

      items = response["items"];
      text = '<ul>\n';
      for(let i = 0; i < items.length; i++) text += "<li> " + items[i][0] + ", " + items[i][1] + ".</li>\n";
      text += "</ul>";

      document.getElementById('items').innerHTML = text;
    }
  });
}

function moveup(){
  if(document.getElementById("upbt").style.opacity == 0.3) return ;

  document.getElementById("dynamicorders").innerHTML = pages[--currentPage];
  if(currentPage == 0) document.getElementById("upbt").style.opacity = 0.3;
  document.getElementById("downbt").style.opacity = 1;
  document.getElementById("dynamicorders").children[0].onclick();
}

function movedown(){
  if(document.getElementById("downbt").style.opacity == 0.3) return ;

  document.getElementById("dynamicorders").innerHTML = pages[++currentPage];
  if(currentPage == pages.length - 1) document.getElementById("downbt").style.opacity = 0.3;
  document.getElementById("upbt").style.opacity = 1;
  document.getElementById("dynamicorders").children[0].onclick();
}