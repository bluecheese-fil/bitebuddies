function removeChange(event){
  let id = event.target.id;
  let elem = document.getElementById("item");

  if(id == "form_container" || id == "first_item" || id == "second_item" || id == "submit_item") return false;
  
  if(!(id == "cambiaemail" || id == "cambiapassword")) {
    elem.style.opacity = "0";
    elem.style.visibility = "hidden";
  } else {
    elem.style.opacity = "1";
    elem.style.visibility = "visible";
  }
}