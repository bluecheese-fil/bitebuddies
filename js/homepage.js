function isLogged() {
  let jsoncookie = {};
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }

  if(!jsoncookie.hasOwnProperty("saveduser") || !jsoncookie.hasOwnProperty("iv")){
    document.getElementById("personallogin").remove();
    return ;
  }

  $.ajax({
    url: "/php/homepage.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success: function(response){
      if(response["usrfound"] == 0) document.getElementById("personallogin").remove();
      else {
        document.getElementById("name").textContent += response["name"];
        document.getElementById("personallogin").removeAttribute("hidden");
        document.getElementById("fastredirect").remove();
      }
    }
  });
}