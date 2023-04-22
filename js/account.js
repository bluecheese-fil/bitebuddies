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

  $.ajax({
    url:"/php/account_helper.php",  //the page containing php script
    type: "post",                   //request type,
    dataType: 'json',
    data: {changeToken: "true"},
    success: function(){ console.log("Success"); location.reload(); }
  });
}