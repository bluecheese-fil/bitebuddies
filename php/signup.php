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

      /*  The ones I've made are basic error checking.
          This where checked before the connection to the database */
      if($errors != ""){
        header("Location: /account/signup.html?errors=[{$errors}]");
        die();
      }

      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
      $username_exists = "select username from utenti where username = '{$username}'";

      $result = pg_query($username_exists) or die('Query failed:'.pg_last_error());
      if(pg_num_rows($result) != 0) $errors = "username|taken";
      pg_free_result($result);

      $email_exists = "select email from utenti where email = '{$email1}'";
      $result = pg_query($email_exists) or die('Query failed:'.pg_last_error());
      if(pg_num_rows($result) != 0){
        if($errors == "") $errors = "email|taken";
        else $errors = $errors.",email|taken";
      }
      pg_free_result($result);

      if($errors != ""){
        pg_close($db); //closing connection before the redirect
        header("Location: /account/signup.html?errors=[{$errors}]");
        die();
      }

      // once all of this have worked, I can finally add this informations to the database
      
      // adding to the first relation
    ?>
  </body>
</html>

