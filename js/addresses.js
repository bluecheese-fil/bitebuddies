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

  // If it's "ok" (client side), I can submit the form and pass it to the server
  if(isOk){
    $.ajax({
      url:"/php/address_helper.php",   //the page containing php script
      type: "post",                   //request type,
      dataType: 'json',
      data: {addadr: text},
      success:function(){ console.log("Success"); location.reload();}
    });
  }

  return isOk;
}

function def_ind(ind_n) {
  text = document.getElementById("indr" + ind_n).textContent;

  $.ajax({
    url:"/php/address_helper.php",   //the page containing php script
    type: "post",                   //request type,
    dataType: 'json',
    data: {mkdef: text},
    success:function(){ console.log("Success"); location.reload();}
  });
}

function del_ind(ind_n){
  text = document.getElementById("indr" + ind_n).textContent;
  let confermed = confirm("Are you sure you want to delete the follwing address?\n" + text);

  if(!confermed) return false;

  $.ajax({
    url:"/php/address_helper.php",   //the page containing php script
    type: "post",                   //request type,
    dataType: 'json',
    data: {del: text},
    success:function(){ console.log("Success"); location.reload();}
  });
}

function quitUser(){
  document.cookie = "saveduser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "iv=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  window.location.replace("/homepage.php");
}