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
    loginForm.style.height = "26vh";
    loginForm.style.minHeight = "200px";
  } else if(document.cookie.search("saveduser") != -1){
    // if the cookie is set, I don't need the user to submit any information
    document.getElementById("loginform").submit();
  }
}

function customSubmit(){
  // I remember the used email in case of an error
  sessionStorage.setItem("savedemail", document.getElementById("email").value);
  document.getElementById("loginform").submit();
}