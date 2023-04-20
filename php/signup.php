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
      $indirizzo = $_POST["indirizzo"].", ".$_POST["cap"].", ".$_POST["citta"];

      // I'm checking errors server side. In case anyone changed the javascript
      $errors = "";

      if($nome == "") $errors = "nome|blank";
      
      if($cognome == ""){
        if($errors == "") $errors = "cognome|blank";
        else $errors = $errors.",cognome|blank";
      }

      // checking if address is correct (if some parts are given, all must be given)
      if(!(($_POST["indirizzo"] == "" && $_POST["cap"] == "" && $_POST["citta"] == "") || ($_POST["indirizzo"] != "" && $_POST["cap"] != "" && $_POST["citta"] != ""))){
        if($errors == "") $errors = "indirizzo|incomplete";
        else $errors = $errors.",indirizzo|incomplete";
      }

      if(strlen($_POST["cap"]) > 0 && (strlen($_POST["cap"]) != 5 || !is_numeric($_POST["cap"]))){
        if($errors == "") $errors = "cap|invalid";
        else $errors = $errors.",cap|invalid";
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


      $email1 = str_replace("'", "&#39", $email1);
      $nome = str_replace("'", "&#39", $nome);
      $cognome = str_replace("'", "&#39", $cognome);
      $tel = str_replace("'", "&#39", $tel);
      $indirizzo = str_replace("'", "&#39", $indirizzo);

      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

      $email_exists = "select email from utenti where email = '{$email1}'";
      $result = pg_query($db, $email_exists) or die('Query failed:'.pg_last_error());
      if(pg_num_rows($result) != 0){
        if($errors == "") $errors = "email|taken";
        else $errors = $errors.",email|taken";
      }
      pg_free_result($result);
      pg_close($db);

      if($errors != ""){
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

      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
      $insert_transaction = "
      begin;
      insert into utenti(email, passwd) values('{$email1}', '{$hashedpasswd}');
      insert into persone(nome, cognome) values('{$nome}', '{$cognome}');
      do
      $$
      declare
        usrid int;
      begin
        select user_id into usrid from utenti where  email='{$email1}';
        if not found then
          raise exception 'no row found';
        else";
      
      if($indirizzo != ""){
        $insert_transaction = $insert_transaction."\t\tinsert into indirizzi(user_id, indirizzo, def_indirizzo) values(usrid, '{$indirizzo}', true);";
      }

      $insert_transaction = $insert_transaction."
          insert into telefoni(user_id, telefono, def_telefono) values(usrid, '{$tel}', true);
        end if;
      end;
      $$;
      commit;";

      $result = pg_query($db, $insert_transaction) or die('Query failed:'.pg_last_error());
      pg_free_result($result);
      pg_close($db);

      // I then need a redirect in case everything goes perfectly! :)
      echo "
        <div>
          Signup successful. You are now being redirected to the login page... 
        </div>
      ";

      header("refresh:3; url = /account/login.html");
      die()
    ?>
  </body>
</html>

