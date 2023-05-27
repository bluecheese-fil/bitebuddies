function quitUser(redirect = null){
  document.cookie = "saveduser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "iv=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "temporary=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  if(redirect != null) document.location.href = redirect;
}

function isLogged() {
  let jsoncookie = {};
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser") jsoncookie[point[0]] = point[1];
  }
  
  if(!jsoncookie.hasOwnProperty("saveduser") || !jsoncookie.hasOwnProperty("iv")){ $("#personallogin").remove(); return ; }
  
  $.ajax({
    url: "/php/homepage.php",
    type: "POST",
    dataType: "JSON",
    data: (jsoncookie),
    success: function(response){
      if(response["usrfound"] == 0) $("#personallogin").remove();
      else {
        $("#name").text("Ciao " + response["name"]);
        $("#personallogin").removeAttr("hidden"); $("#fastredirect").remove();
      }
    },
    error: function(){ 
      console.log("Server error");
      alert("A causa di un errore del server, al momento non è possibile accedere al proprio account o fare ordini. Ci scusiamo per il disagio");
    }
  });
}