function loadSignup(){
  // In case this redirect is coming from the "login" page. This will be discarded in case
  // it's coming from the php page with errors
  saved_email = sessionStorage.getItem("signupemail");
  saved_passwd = sessionStorage.getItem("signuppasswd");
  sessionStorage.removeItem("signupemail");
  sessionStorage.removeItem("signuppasswd");

  url = new URL(window.location.href);
  errorparameter = url.searchParams.get('errors');

  // this is the case where 
  if(errorparameter != null){
    errorparameter = errorparameter.substring(1, errorparameter.length - 1);
    errors = errorparameter.split(',');

    for(let i = 0; i<errors.length; i++){
      errortype = errors.split('|');
      if(errortype[0] == "nome"){
        // there is only a blank error, for now
        document.getElementById("errornome").removeAttribute("hidden");
      } else if(errortype[0] == "cognome"){
        // there is only a blank error, for now
        document.getElementById("errorcognome").removeAttribute("hidden");
      } else if(errortype[0] == "email"){
        if(errtype[1] == "blank"){
          document.getElementById("erroreemail_1").removeAttribute("hidden");
          document.getElementById("erroreemail_2").removeAttribute("hidden");
        } else if(errortype[1] == "notequal"){
          document.getElementById("diversaemail").removeAttribute("hidden");
        } else if(errortype[1] == "invalid"){
          document.getElementById("invalidaemail").removeAttribute("hidden");
        } else if(errortype[1] == "taken"){
          document.getElementById("emailtaken").removeAttribute("hidden");
        }
      } else if(errortype[0] == "password"){
        if(errtype[1] == "blank"){
          document.getElementById("errorepassword_1").removeAttribute("hidden");
          document.getElementById("errorepassword_2").removeAttribute("hidden");
        } else if(errortype[1] == "notequal"){
          document.getElementById("diversapassword").removeAttribute("hidden");
        } else if(errortype[1] == "invalid"){
          document.getElementById("passwordinvalida").setAttribute('hidden', true);
        }
      } else if(errortype[0] == "tel"){
        if(errtype[1] == "blank") document.getElementById("erroretel").removeAttribute("hidden");
        else if(errortype[1] == "invalid") document.getElementById("telinvalido").removeAttribute("hidden");
      }
      return false;
    }
  }
  
  if(saved_email == null || saved_passwd == null) return false;
  document.getElementById("email_1").value = saved_email;
  document.getElementById("password_1").value = saved_passwd;
}

// I'm using custom function to mark a particular item as "touched". When that happens, I can say for certain that, if it's still empty, then something must be written there
function checkText(elem){
  htmlElem = document.getElementById(elem);
  if(htmlElem.value == "") document.getElementById("errore" + elem).removeAttribute('hidden');
  else document.getElementById("errore" + elem).setAttribute('hidden', true);

  if(elem == "password_2"){
    otherHTMLElem = document.getElementById("password_1")
    if(htmlElem.value != otherHTMLElem.value && htmlElem.value != "" && otherHTMLElem.value != "") document.getElementById("diversapassword").removeAttribute('hidden');
    else document.getElementById("diversapassword").setAttribute('hidden', true);
  } else if(elem == "password_1"){
    otherHTMLElem = document.getElementById("password_2")
    if(htmlElem.value != otherHTMLElem.value && htmlElem.value != "" && otherHTMLElem.value != "") document.getElementById("diversapassword").removeAttribute('hidden');
    else document.getElementById("diversapassword").setAttribute('hidden', true);
    
    // se tutto va senza problemi tutti i caratteri sono supportati!
    document.getElementById('charunsupported').setAttribute('hidden', true);

    passwd = htmlElem.value;
    // if it's empty, passwd will have a len of 0
    if(passwd.length == 0){
      document.getElementById("passwordinvalida").setAttribute('hidden', true);
      document.getElementById('charunsupported').setAttribute('hidden', true);
    } else if(passwd.length < 8){   // checking if it's valid
      document.getElementById("passwordinvalida").removeAttribute('hidden');
    } else {
      uppercase = 0; lowercase = 0; special = 0; numbers = 0;
      for(let i = 0; i<passwd.length; i++){

        charnumber = passwd[i].charCodeAt(0);

        if((charnumber >= 33 && charnumber <= 47) || (charnumber >= 58 && charnumber <= 64) || (charnumber >= 91 && charnumber <= 96) || (charnumber >= 123 && charnumber <= 126)) special++;
        else if(charnumber >= 97 && charnumber <= 122) lowercase++;
        else if(charnumber >= 65 && charnumber <= 90) uppercase++;
        else if(charnumber >= 48 && charnumber <= 57) numbers++;
        else {
          document.getElementById('charunsupported').innerHTML = ("'" + passwd[i] + "' non supportato");
          document.getElementById('charunsupported').removeAttribute('hidden');
          break;
        }
      }

      if(uppercase >= 2 && lowercase >= 2 && special >= 2 && numbers >= 2){
        document.getElementById("passwordinvalida").setAttribute('hidden', true);
      }
    }
  }


  if(elem == "email_1"){
    const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    otherHTMLElem = document.getElementById("email_2")

    // As soon as the first email has been changed, I can remove the "taken" error
    document.getElementById("emailtaken").setAttribute('hidden', true);

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

  // if email is taken, I can just check if the error is visible again
  if(!document.getElementById("emailtaken").hasAttribute('hidden')) isOk = false;

  // The same reasoning can go into the password ...
  if(!document.getElementById("diversapassword").hasAttribute('hidden')) isOk = false;
  if(!document.getElementById("passwordinvalida").hasAttribute('hidden')) isOk = false;
  if(!document.getElementById("charunsupported").hasAttribute('hidden')) isOk = false;
  
  if(document.getElementById("tel").value == ""){
    document.getElementById("erroretel").removeAttribute('hidden');
    isOk = false;
  }

  // ... and for the phone number too
  if(!document.getElementById("telinvalido").hasAttribute('hidden')) isOk = false;

  if(isOk){
    // If it's "ok" (client side), I can submit the form and pass it to the server
    document.getElementById("signupform").submit()
  }

  return isOk;
}