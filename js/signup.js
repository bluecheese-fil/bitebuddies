function loadLoginIntoSignup(){
  saved_email = sessionStorage.getItem("saved_email");
  if(saved_email == null || saved_email == "null") return false;

  document.getElementById("email_1").value = saved_email;
  sessionStorage.setItem("saved_email", null)

  saved_passwd = sessionStorage.getItem("saved_password");
  if(saved_passwd == null || saved_passwd == null) return false;

  document.getElementById("password_1").value = saved_passwd;
  sessionStorage.setItem("saved_password", null)
}

// I'm using custom function to mark a particular item as "touched". When that happens, I can say for certain that, if it's still empty, then something must be written there
function checkText(elem){

  var formText = document.getElementById(elem).value
  if(formText == ""){
    document.getElementById("errore" + elem).removeAttribute('hidden')
  } else {
    document.getElementById("errore" + elem).setAttribute('hidden', true)
  }
}