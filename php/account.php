<?php
  require "./cookie_helper.php";

  $hexiv = $_POST["iv"];
  $iv = hextocharCookie($hexiv);

  $hexinfo = $_POST["saveduser"];
  $info = hextocharCookie($hexinfo);

  // checking that iv is correct and that token matches with server
  if(strlen($iv) != openssl_cipher_iv_length("aes-256-cbc") || !verifyToken($info, $iv)) { deleteLoginCookie(); die(json_encode(array('success' => 1, 'usrfound' => 0))); }

  if(array_key_exists("changeToken", $_POST)) { changeToken($info, $iv, $temporary, $_POST["temporary"]); }
  else if(array_key_exists("dynamic", $_POST)) { getItems($info, $iv); }
  else if(array_key_exists("changeemail", $_POST)) { changeEmail($info, $iv, $temporary, $_POST["email1"], $_POST["email2"]); }
  else if(array_key_exists("changepassword", $_POST)) { changePassword($info, $iv, $_POST["temporary"], $_POST["password1"], $_POST["password2"]); }
  else if(array_key_exists("deleteaccount" , $_POST)) { deleteAccount($info, $iv, $_POST["email"], $_POST["password"]); }

  function deleteAccount($info, $iv, $email, $password){
    $cipher = "aes-256-cbc"; $delimiter = chr(007);
    $items = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv));

    $usrid = $items[0]; $email = $items[1]; $token = $items[2];

    // checking token validity:
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $validtoken = "select token from utenti where user_id = '{$usrid}'";
    $result = pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    if(pg_fetch_array($result, null, PGSQL_NUM)[0] != $token) { echo json_encode(array("success" => "1", "account" => "undelited", "error" => "unverified")); die(); }
    pg_free_result($result);

    // checking retyped email and password validity
    $emailpswd = "select email, passwd from utenti where user_id = '{$usrid}'";
    $result = pg_query($db, $emailpswd) or die('Query failed:'.pg_last_error());
    $emailpswd = pg_fetch_array($result, null, PGSQL_NUM);
    if($emailpswd[0] != $email || !password_verify($password, $emailpswd[1])) { echo json_encode(array("success" => "1", "account" => "undelited", "error" => "email|password")); die(); }

    // i can now delete every element of the user. I can delete on the "utenti" table, everything should just get deleted because of the "ON DELETE: CASCADE" handler on the database
    $delete = "delete from utenti where user_id = '{$usrid}'";
    $result = pg_query($db, $delete) or die('Query failed:'.pg_last_error());
    pg_free_result($result);
    pg_close($db);

    // echo success
    echo json_encode(array("success" => "1", "account" => "deleted"));
  }

  function changeEmail($info, $iv, $temporary, $email1, $email2){
    $email_exp = "/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/";
    if($email1 == ""){ echo json_encode(array("success" => "1", "error" => "emailinvalid")); return ; }
    else if($email1 != $email2){ echo json_encode(array("success" => "1", "error" => "notequal")); return ; }
    else if(preg_replace($email_exp, "", $email2) != ""){ echo json_encode(array("success" => "1", "error" => "emailinvalid")); return ; }

    $email1 = str_replace("'", "&#39", $email1);

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $email_exists = "select email from utenti where email = '{$email1}'";
    $result = pg_query($db, $email_exists) or die('Query failed:'.pg_last_error());
    if(pg_num_rows($result) != 0){ echo json_encode(array("success" => "1", "error" => "emailtaken")); return ; }
    pg_free_result($result);

    $cipher = "aes-256-cbc";
    $delimiter = chr(007);
    $items = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv));
    
    $upd_email = "
    begin;
      update utenti set email = '{$email1}' where user_id = '{$items[0]}';
    commit;";
    $result = pg_query($db, $upd_email) or die('Query failed:'.pg_last_error());
    pg_free_result($result);
    pg_close($db);

    // encrypting the information
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
    $ck = openssl_encrypt("{$items[0]}{$delimiter}{$email1}{$delimiter}{$items[2]}", "aes-256-cbc", "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv);
    
    if($temporary == "false"){ //saving the token since "remember me" has been selected
      // Expires in 90 days
      $ninetydays = time() + 3600*24*90;
      setcookie("saveduser", $ck, $expires_or_options=$ninetydays, $path="/");
      setcookie("iv", $iv, $expires_or_options=$ninetydays, $path="/");
    } else {
      // This cookie will expire after closing the session. This is used for user identification
      setcookie("saveduser", $ck, $expires_or_options=0, $path="/");
      setcookie("iv", $iv, $expires_or_options=0, $path="/");
    }

    echo json_encode(array("success" => "1", "type" => "email"));
  }

  function changePassword($info, $iv, $temporary, $password1, $password2){
    // checking password validity
    if($password1 == ""){ echo json_encode(array("success" => "1", "error" => "passwordinvalid")); return ; }
    else if($password1 != $password2){ echo json_encode(array("success" => "1", "error" => "notequal")); return ; }
    else {
      if(strlen($password1) < 8) { echo json_encode(array("success" => "1", "error" => "passwordinvalid")); return ; }
      else {
        $ucase = 0; $lcase = 0; $special = 0; $num = 0;
        for($i = 0; $i < strlen($password1); $i++){
          $charcode = ord(substr($password1, $i, 1));

          if(($charcode >= 33 && $charcode <= 47) || ($charcode >= 58 && $charcode <= 64) || ($charcode >= 91 && $charcode <= 96) || ($charcode >= 123 && $charcode <= 126)) $special++;
          else if($charcode >= 97 && $charcode <= 122) $lcase++;
          else if($charcode >= 65 && $charcode <= 90) $ucase++;
          else if($charcode >= 48 && $charcode <= 57) $num++;
        }

        if($ucase < 2 || $lcase < 2 || $special < 2 || $num < 2) { echo json_encode(array("success" => "1", "error" => "passwordinvalid")); return ; }
      }
    }

    $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];

    // hashing the password, I also rehash it in case password verify doesn't work
    $loopcounter = 0;
    do {
      if($loopcounter > 15) die(); // the password cannot be hashed
    
      $hashedpasswd = password_hash($password1, PASSWORD_DEFAULT);
      $loopcounter++;
    } while(!password_verify($password1, $hashedpasswd));

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $upd_token = "
    begin;
      update utenti set passwd = '{$hashedpasswd}' where user_id = '{$usrid}';
    commit;";

    $result = pg_query($db, $upd_token) or die('Query failed:'.pg_last_error());
    pg_free_result($result);
    pg_close($db);

    changeToken($info, $iv, $temporary);
  }

  function changeToken($info, $iv, $temporary){
    $delimiter = chr(007);
    $cipher = "aes-256-cbc";
    $items = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv));

    $token = randomToken();

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $upd_token = "
    begin;
      update utenti set token = '{$token}' where user_id = '{$items[0]}';
    commit;";

    $result = pg_query($db, $upd_token) or die('Query failed:'.pg_last_error());
    pg_free_result($result);
    pg_close($db);

    // encrypting the information
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
    $ck = openssl_encrypt("{$items[0]}{$delimiter}{$items[1]}{$delimiter}{$token}", "aes-256-cbc", "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv);
    
    if($temporary == "false"){ //saving the token since "remember me" has been selected
      // Expires in 90 days
      $ninetydays = time() + 3600*24*90;
      setcookie("saveduser", $ck, $expires_or_options=$ninetydays, $path="/");
      setcookie("iv", $iv, $expires_or_options=$ninetydays, $path="/");
    } else {
      // This cookie will expire after closing the session. This is used for user identification
      setcookie("saveduser", $ck, $expires_or_options=0, $path="/");
      setcookie("iv", $iv, $expires_or_options=0, $path="/");
    }

    echo json_encode(array("success" => "1", "type" => "password"));
  }

  function getItems($info, $iv){
    $delimiter = chr(007);
    $cipher = "aes-256-cbc";
    $items = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv));
    $usrid = $items[0];

    // make sure the user exists
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

    $email = "
      select email
      from utenti
      where user_id = '{$usrid}'
    ";

    $result = pg_query($db, $email) or die('Query failed:'.pg_last_error());
    $email = pg_fetch_array($result, null, PGSQL_NUM); //array with indexes a number
    pg_free_result($result);

    if($email == false || $email[0] != $items[1]){
      echo json_encode(array('usrfound' => '0'));
      die();
    }

    $name = "
      select nome
      from persone
      where user_id = '{$usrid}' 
    ";

    $email = "
      select email
      from utenti
      where user_id = '{$usrid}'
    ";

    $result = pg_query($db, $name) or die('Query failed:'.pg_last_error());
    $name = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
    pg_free_result($result);

    $result = pg_query($db, $email) or die('Query failed:'.pg_last_error());
    $email = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
    pg_free_result($result);
    pg_close($db);

    echo json_encode(array("success" => '1', 'name' => $name, 'email' => $email));
  }
?>