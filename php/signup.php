<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <?php
      // getting all the arguments
      $nome = $_POST["nome"];
      $cognome = $_POST["cognome"];
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
      } else {
        if(strlen($password1) < 8){
          if($errors == "") $errors = "password|invalid";
          else $errors = $errors.",password|invalid";
        } else {
          $ucase = 0; $lcase = 0; $special = 0; $num = 0;
          for($i = 0; $i < strlen($password1); $i++){
            $charcode = ord(substr($password1, $i, 1));

            if(($charcode >= 33 && $charcode <= 47) || ($charcode >= 58 && $charcode <= 64) || ($charcode >= 91 && $charcode <= 96) || ($charcode >= 123 && $charcode <= 126)) $special++;
            else if($charcode >= 97 && $charcode <= 122) $lcase++;
            else if($charcode >= 65 && $charcode <= 90) $ucase++;
            else if($charcode >= 48 && $charcode <= 57) $num++;
          }

          if($ucase < 2 || $lcase < 2 || $special < 2 || $num < 2){
            if($errors == "") $errors = "password|invalid";
            else $errors = $errors.",password|invalid";
          }
        }
      }

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

      // hashing the password, I also rehash it in case password verify doesn't work
      $loopcounter = 0;
      do {
        if($loopcounter > 15) die(); // the password cannot be hashed

        $hashedpasswd = password_hash($password1, PASSWORD_DEFAULT);
        $loopcounter++;
      } while(!password_verify($password1, $hashedpasswd));

      // once all of this have worked, I can finally add this informations to the database
      /*  I'm using a transaction since user_id is a serial! It will have the same value in both
          utenti and persone as long as they're added togheter and at the same time! Since transaction
          assures atomicity, it's going to work perfectly!" */

      // TODO, finish the transaciton
      $insert_transaction = "
      begin transaction;
      insert into utenti(email, passwd) values ({$email1}, {$hashedpasswd});
      insert into persone(nome, cognome) values ({}, {});


      !! I NEED TO GET THE SERIAL CREATED WITH A QUERY


      insert into telefono() values ({}, {});
      end transaction
      ";

      //$result = pg_query($insert_transaction) or die('Query failed:'.pg_last_error());
      //pg_free_result($result);

      // I then need a redirect in case everything goes perfectly! :)
    ?>
  </body>
</html>

