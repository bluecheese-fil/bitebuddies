function loadDynamic(){
  let jsoncookie = {"getOrders" : "true"};

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

      console.log(response);

      if(response["orders"] == "none") document.getElementById("orderdiv").remove();
      else {
        orders = response["orders"];

        let totalHeight = document.getElementById("orderdiv").offsetHeight - 2*document.querySelector(".updown_button").offsetHeight;
        document.getElementById("dynamicorders").style.height = totalHeight + "px";
        document.getElementById("currentorder").style.marginTop = document.querySelector(".updown_button").offsetHeight + "px";
        document.getElementById("currentorder").style.marginBottom = document.querySelector(".updown_button").offsetHeight + "px";
        document.getElementById("currentorder").style.height = totalHeight + "px";

        for(let i = 0; i < Math.floor(orders.length / 5); i += 1){
        pages[i] = `
          <div class="leftorder_element" id = "page` + i + `-0" style="background-color: green" onclick="changeColor('page` + i + `-0', '` + orders[i*5][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5][0] + `</div>
            <div id="date_order1" class="leftorder_info"> ` + orders[i*5][1] + `</div>
          </div>
          <div class="leftorder_element" id = "page` + i + `-1" style="background-color: red" onclick="changeColor('page` + i + `-1', '` + orders[i*5 + 1][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5 + 1][0] + `</div>
            <div id="date_order1" class="leftorder_info"> ` + orders[i*5 + 1][1] + `</div>
          </div>
          <div class="leftorder_element" id = "page` + i + `-2" style="background-color: blue" onclick="changeColor('page` + i + `-2', '` + orders[i*5 + 2][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5 + 2][0] + `</div>
            <div id="date_order1" class="leftorder_info"> ` + orders[i*5 + 2][1] + `</div>
          </div>
            <div class="leftorder_element" id = "page` + i + `-3" style="background-color: purple" onclick="changeColor('page` + i + `-3', '` + orders[i*5 + 3][0] + `')">
            <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
            <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i*5 + 3][0] + `</div>
          <div id="date_order1" class="leftorder_info"> ` + orders[i*5 + 3][1] + `</div>
          </div>
            <div class="leftorder_element" id = "page` + i + `-4" style="background-color: black" onclick="changeColor('page` + i + `-4', '` + orders[i*5 + 4][0] + `')">
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
            </div>
              <div class="leftorder_element" id="page` + page + `-` + i + `" onclick="changeColor('page` + page + `-` + i +`', '` + orders[i][0] + `')">
              <img class="little_image" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dsc0388-jpeg-1620296484.jpeg?crop=1.00xw:1.00xh;0,0&resize=640:*">
              <div id="order_id1" class="leftorder_info"> Ordine: ` + orders[i][0] + `</div>
              <div id="date_order1" class="leftorder_info"> ` + orders[i][1] + `</div>
            </div>
          `;
        }

        document.getElementById("noorders").remove();
        document.getElementById("dynamicorders").innerHTML = pages[currentPage];
        document.getElementById("upbt").style.opacity = 0.3;
        document.getElementById("orderdiv").style.opacity = 1;
      }
    }
  });
}

function changeColor(id, order_id){
  console.log(id);
  let color = document.getElementById(id).style.backgroundColor;
  document.getElementById("currentorder").style.backgroundColor = color;
}

function resizeElements(){
  let totalHeight = document.getElementById("orderdiv").offsetHeight - 2*document.querySelector(".updown_button").offsetHeight;
  document.getElementById("dynamicorders").style.height = totalHeight + "px";
  console.log("resize");
}

function moveup(){
  if(document.getElementById("upbt").style.opacity == 0.3) return ;

  document.getElementById("dynamicorders").innerHTML = pages[--currentPage];
  if(currentPage == 0) document.getElementById("upbt").style.opacity = 0.3;
  document.getElementById("downbt").style.opacity = 1;
}

function movedown(){
  if(document.getElementById("downbt").style.opacity == 0.3) return ;

  document.getElementById("dynamicorders").innerHTML = pages[++currentPage];
  if(currentPage == pages.length - 1) document.getElementById("downbt").style.opacity = 0.3;
  document.getElementById("upbt").style.opacity = 1;
}

function loadOrder(order_id){
  let jsoncookie = {"getItems" : "true"};
  jsoncookie["order"] = order_id;

  $.ajax({
    url: "/php/orderhistory.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success:function(response){
      document.getElementById("idspan").innerHTML = `Numero ordine: ${order_id}`;
      document.getElementById("nomerist").innerHTML = `Ristorante ${response["rist"]}`;

      let arr = response["items"];
    }
  });
}