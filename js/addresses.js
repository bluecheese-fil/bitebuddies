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

  // If it's "ok" (client side), I can submit the form and pass it to the server
  if(isOk) document.getElementById("form_addadr").submit();

  return isOk;
}