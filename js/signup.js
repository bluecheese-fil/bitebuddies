function loadLoginIntoSignup(){
  saved_email = sessionStorage.getItem("signupemail");
  saved_passwd = sessionStorage.getItem("signuppasswd");
  
  sessionStorage.removeItem("signupemail")
  sessionStorage.removeItem("signuppasswd")
  
  if(saved_email == null || saved_passwd == null) return false;

  document.getElementById("email_1").value = saved_email;
  document.getElementById("password_1").value = saved_passwd;
}

// I'm using custom function to mark a particular item as "touched". When that happens, I can say for certain that, if it's still empty, then something must be written there
function checkText(elem){

  htmlElem = document.getElementById(elem)
  if(htmlElem.value == "") document.getElementById("errore" + elem).removeAttribute('hidden')
  else document.getElementById("errore" + elem).setAttribute('hidden', true)

  if(elem == "password_2"){
    otherHTMLElem = document.getElementById("password_1")
    if(htmlElem.value != otherHTMLElem.value && htmlElem.value != "" && otherHTMLElem.value != "") document.getElementById("diversapassword").removeAttribute('hidden')
    else document.getElementById("diversapassword").setAttribute('hidden', true)
  } else if(elem == "password_1"){
    otherHTMLElem = document.getElementById("password_2")
    if(htmlElem.value != otherHTMLElem.value && htmlElem.value != "" && otherHTMLElem.value != "") document.getElementById("diversapassword").removeAttribute('hidden')
    else document.getElementById("diversapassword").setAttribute('hidden', true)
  }

  if(elem == "email_1"){
    const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    otherHTMLElem = document.getElementById("email_2")

    if(htmlElem.value != "" && !re.test(htmlElem.value)) document.getElementById("invalidaemail").removeAttribute('hidden')
    else if(htmlElem.value != otherHTMLElem.value && htmlElem.value != "" && otherHTMLElem.value != ""){
      document.getElementById("invalidaemail").setAttribute('hidden', true)
      document.getElementById("diversaemail").removeAttribute('hidden')
    } else {
      document.getElementById("diversaemail").setAttribute('hidden', true)
      document.getElementById("invalidaemail").setAttribute('hidden', true)
    }
  } else if(elem == "email_2"){
    otherHTMLElem = document.getElementById("email_1")
    if(htmlElem.value != otherHTMLElem.value && htmlElem.value != "" && otherHTMLElem.value != "") document.getElementById("diversaemail").removeAttribute('hidden')
    else document.getElementById("diversaemail").setAttribute('hidden', true)
  }

  if(elem == "tel"){
    const re = /^([+]39|0039)?[0-9]{10}$/
    if(htmlElem.value != "" && !re.test(htmlElem.value)) document.getElementById("telinvalido").removeAttribute('hidden')
    else document.getElementById("telinvalido").setAttribute('hidden', true)
  }
}

function verifyForm(){
  isOk = true

  if(document.getElementById("nome").value == ""){
    document.getElementById("errorenome").removeAttribute('hidden')
    isOk = false;
  }
  
  if(document.getElementById("cognome").value == ""){
    document.getElementById("errorecognome").removeAttribute('hidden')
    isOk = false;
  }
  
  if(document.getElementById("email_1").value == ""){
    document.getElementById("erroreemail_1").removeAttribute('hidden')
    isOk = false;
  }
  
  if(document.getElementById("email_2").value == ""){
    document.getElementById("erroreemail_2").removeAttribute('hidden')
    isOk = false;
  }
  
  // For different email or invalid email, I can just check if those items are visible
  if(!document.getElementById("invalidaemail").hasAttribute('hidden') ||
  !document.getElementById("diversaemail").hasAttribute('hidden')) isOk = false;
  
  if(document.getElementById("password_1").value == ""){
    document.getElementById("errorepassword_1").removeAttribute('hidden');
    isOk = false;
  }
  
  if(document.getElementById("password_2").value == ""){
    document.getElementById("errorepassword_2").removeAttribute('hidden');
    isOk = false;
  }

  // The same reasoning can go into the password ...
  if(!document.getElementById("diversapassword")) isOk = false;
  
  if(document.getElementById("tel").value == ""){
    document.getElementById("erroretel").removeAttribute('hidden');
    isOk = false;
  }

  // ... and for the phone number too
  if(!document.getElementById("telinvalido").hasAttribute('hidden')) isOk = false;


  if(isOk){
    // send to server -> database
  }

  return false;
}