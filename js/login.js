function checkForm(){
  // email is valid?

  // password is valid?
}

function accountCreation(){
  email = document.getElementById("email").value;
  passwd = document.getElementById("password").value
  sessionStorage.setItem("saved_email", email)
  sessionStorage.setItem("saved_password", passwd)
}

function tryLogin(){
  // if either email is not found or password is not correct!
  document.getElementById("errore").style.display = "block";
  document.getElementById("password").value = "";

  const loginForm = document.querySelector('.loginform');
  loginForm.style.width = "55vw";
  loginForm.style.height = "8vh";
  loginForm.style.minWidth = "300px";
  loginForm.style.minHeight = "140px";
}