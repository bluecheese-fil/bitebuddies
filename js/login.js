function accountCreation(){
  email = document.getElementById("email").value;
  passwd = document.getElementById("password").value
  sessionStorage.setItem("signupemail", email)
  sessionStorage.setItem("signuppasswd", passwd)
}

function savedLogin(){
  const loginForm = document.querySelector('.loginform');

  if(localStorage.getItem("user") != null && localStorage.getItem("user") != ""
    && localStorage.getItem("password") != null && localStorage.getItem("password") != ""){
    // make query request for login

    if(false){ //login worked
      window.location.replace("/homepage.html");
    } else {
      document.getElementById("passwordchanged").removeAttribute('hidden');
      
      loginForm.style.height = "23vh";
      loginForm.style.minHeight = "180px";

      localStorage.removeItem("email");
      localStorage.removeItem("password")
    }
  }
}

function tryLogin(){
  const loginForm = document.querySelector('.loginform');

  document.getElementById("passwordchanged").setAttribute('hidden', true);
  loginForm.style.height = "16vh"
  loginForm.style.minHeight = "140px"

  email = document.getElementById("email").value
  passwd = document.getElementById("password").value
  toRemember = document.getElementById("saveaccount").checked

  // make query call to database

  // if found
  if(false){
    
    if(toRemember){
      localStorage.setItem("user") = email;
      localStorage.setItem("password") = passwd;
    }

    window.location.replace("/homepage.html");
  } else {
    // if either email is not found or password is not correct!
    
    document.getElementById("error").removeAttribute('hidden');
    document.getElementById("password").value = ""; 
    
    loginForm.style.height = "26vh";
    loginForm.style.minHeight = "200px";
  }
}