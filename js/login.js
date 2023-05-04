function accountCreation(){
  email = document.getElementById("email").value;
  passwd = document.getElementById("password").value;
  sessionStorage.setItem("signupemail", email);
  sessionStorage.setItem("signuppasswd", passwd);
}

function load(){
  url = new URL(window.location.href);
  errorparameter = url.searchParams.get('error');

  // If php throws an error, then 
  if(errorparameter != null){
    // this will happen only if the login button has been pressed at least once! I can reuse the email
    document.getElementById("email").value = sessionStorage.getItem("savedemail");
    localStorage.removeItem("saveduser");
    
    const loginForm = document.querySelector('.loginform');
    document.getElementById("error").removeAttribute('hidden');
    document.getElementById("password").value = ""; 
    loginForm.style.height = loginForm.style.height + 2;
    loginForm.style.minHeight = "200px";
  } else if(document.cookie.search("saveduser") != -1){
    // if the cookie is set, I don't need the user to submit any information
    console.log("autologin");

    jsncookie = {"login":true}
    let cookies = document.cookie.split("; ");
    for(let i = 0; i<cookies.length; i++){
      let point = cookies[i].split("=");
      if(point[0] == "iv" || point[0] == "saveduser" || point[0] == "temporary") jsncookie[point[0]] = point[1];
    }

    $.ajax({
      url: "/php/login.php",   //the page containing php script
      type: "POST",            //request type,
      dataType: 'JSON',
      data: (jsncookie),
      success:function(response){
        console.log("Server success");
        if(response["error"] == "passwd_error" || response["error"] == "info_error") window.location.replace("/account/login.html?error=passwd_error");
        else if(response["success"] == 1) window.location.replace("/homepg.html");
        console.log("Local success");
      }
    });
  }
}

function customSubmit(){
  // I remember the used email in case of an error
  sessionStorage.setItem("savedemail", document.getElementById("email").value);

  jsncookie = {"login":true}
  let cookies = document.cookie.split("; ");
  for(let i = 0; i<cookies.length; i++){
    let point = cookies[i].split("=");
    if(point[0] == "iv" || point[0] == "saveduser" || point[0] == "temporary") jsncookie[point[0]] = point[1];
  }

  jsncookie["email"] = document.getElementById("email").value;
  jsncookie["password"] = document.getElementById("password").value;
  jsncookie["remember"] = document.getElementById("saveaccount").checked;

  $.ajax({
    url: "/php/login.php",   //the page containing php script
    type: "POST",            //request type,
    dataType: 'JSON',
    data: (jsncookie),
    success:function(response){
      console.log("Server success");
      if(response["error"] == "passwd_error" || response["error"] == "info_error") window.location.replace("/account/login.html?error=passwd_error");
      else if(response["success"] == '1') window.location.replace("/homepg.html");
      console.log("Local success");
    }
  });
}

function removeBorder(){ document.getElementById("email").style.boxShadow = ""; }

function resetPassword(){
  if(document.getElementById("email").value == ""){
    document.getElementById("email").style.boxShadow = "0 0 9px rgb(255, 0, 0)";
    alert("Inserisci la tua email prima di richiedere il reset");
    return ;
  }

  let email = prompt("Per favore, ripeti la tua email", "");

  if(email != document.getElementById("email").value) alert("Gli indirizzi non corrispondono");
  else {
    /* This should send an email, but to use gmail,
    the default mail from php doesn't support tls user and password
    I'm just chaning password from prompts */

    let pswd = prompt("Per favore, inserisci la password", "");
    let pswd2 = prompt("Per favore, ripeti la password", "");

    let info = {}
    info["email"] = email;
    info["password"] = pswd;
    info["reset"] = "true";

    if(pswd != pswd2) alert("Le password non corrispondono");
    else // ajax call
    $.ajax({
      url: "/php/login.php",   //the page containing php script
      type: "POST",            //request type,
      dataType: 'JSON',
      data: (info),
      success:function(response){
        if(response["success"] == "0"){
          console.log("Server error");
          if(response["type"] == "email_not_found") alert("Non è stata trovata la sua email. E' necessario registrarsi prima di poter accedere");
          else if(response["type"] == "password_error") alert("La password scelta non è valida. Deve contenere almeno 2 caratteri speciali, 2 minuscole, 2 maiuscole e 2 numeri");
        } else {
          console.log("Server success");
          alert("La password è stata reimpostata correttamente");
        }
        console.log("Local success");
      }
    });
  }
}