<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <?php
      // getting all the arguments
      $nome = $_POST["nome"];
      $cognome = $_POST["cognome"];
      $username = $_POST["username"];
      $email1 = $_POST["email_1"];
      $email2 = $_POST["email_2"];
      $password1 = $_POST["password_1"];
      $password2 = $_POST["password_2"];
      $tel = $_POST["tel"];
      $indirizzo = $_POST["indirizzo"];

      // I'm checking errors server side. In case anyone changed the javascript
      $errors = "";

      if($nome == "") $errors = "nome|blank";
      
      if($cognome == ""){
        if($errors == "") $errors = "cognome|blank";
        else $errors = $errors.",cognome|blank";
      }

      if($username == ""){
        if($errors == "") $errors = "username|blank";
        else $errors = $errors.",username|blank";
      }

      $email_exp = "/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/";
      if($email1 == ""){
        if($errors == "") $errors = "email|blank";
        else $errors = $errors.",email|blank";
      } else if($email1 != $email2){
        if($errors == "") $errors = "email|notequal";
        else $errors = $errors.",email|notequal";
      } else if(preg_replace($email_exp, "", $email2) != ""){
        if($errors == "") $errors = "email|invalid";
        else $errors = $errors.",email|invalid";
      }

      if($password1 == ""){
        if($errors == "") $errors = "password|blank";
        else $errors = $errors.",password|blank";
      } else if($password1 != $password2){
        if($errors == "") $errors = "password|notequal";
        else $errors = $errors.",password|notequal";
      } // else here i have to setup basic requirements for password

      $tel_exp = "/^([+]39|0039)?[0-9]{10}$/";
      $telcpy = $tel;

      if($telcpy == ""){
        if($errors == "") $errors = "tel|blank";
        else $errors = $errors.",tel|blank";
      } else if(preg_replace($tel_exp, "", $telcpy) != ""){
        if($errors == "") $errors = "tel|invalid";
        else $errors = $errors.",tel|invalid";
      }

      if($errors != "" && false){
        header("Location: /account/signup.html?errors=[{$errors}]");
        die();
      }

      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
      
      echo $email1."\n";
      echo $email2;
    ?>
  </body>
</html>

