
<?php
  require "./cookie_helper.php";

  if(array_key_exists("reset", $_POST)) { resetPassword($_POST["email"], $_POST["password"]); }
  else if(array_key_exists("login", $_POST)) { login($_POST["email"], $_POST["password"], $_POST["remember"], $_POST["iv"], $_POST["saveduser"], $_POST["temporary"]); }

  function resetPassword($email, $password){
    //checking new password validity
    if($password == "" || strlen($password) < 8) {
      echo json_encode(array('success' => '0', 'type' => 'password_error'));
      die();
    }
    
    $ucase = 0; $lcase = 0; $special = 0; $num = 0;
    for($i = 0; $i < strlen($password); $i++){
      $charcode = ord(substr($password, $i, 1));
      if(($charcode >= 33 && $charcode <= 47) || ($charcode >= 58 && $charcode <= 64) || ($charcode >= 91 && $charcode <= 96) || ($charcode >= 123 && $charcode <= 126)) $special++;
      else if($charcode >= 97 && $charcode <= 122) $lcase++;
      else if($charcode >= 65 && $charcode <= 90) $ucase++;
      else if($charcode >= 48 && $charcode <= 57) $num++;
    }
    
    if($ucase < 2 || $lcase < 2 || $special < 2 || $num < 2){
      echo json_encode(array('success' => '0', 'type' => 'password_error'));
      die();
    }
    
    // check that the email exists in the database
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $email_exists = "select user_id from utenti where email = '{$email}'";
    $result = pg_query($db, $email_exists) or die('Query failed:'.pg_last_error());
    $usrid = pg_fetch_row($result, null, PGSQL_NUM); //array with indexes a number
    pg_free_result($result);
    pg_close($db);
    
    if(!$usrid){
      echo json_encode(array('success' => '0', 'type' => 'email_not_found'));
      die();
    } else $usrid = $usrid[0];
    

    // I can now update the password and change token
    $token = randomToken();
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    
    $update_query = "
      update utenti
      set password = '{$password}'
        token = '{$token}'
      where user_id = '{$usrid}'
    ";

    $result = pg_query($db, $update_query) or die('Query failed:'.pg_last_error());
    pg_free_result($result);
    pg_close($db);

    echo json_encode(array('success' => '1'));
  }

  function login($email, $password, $remember, $iv, $info, $expiry){
    if($email == "" || $password == ""){
      echo json_encode(array('error' => 'info_error'));
      die();
    }
    
    $cipher = "aes-256-cbc";
    $delimiter = chr(007); // bell (licence to kill)
    
    if($email == "" || $password == ""){ // I am giving priority to the set email and password
      $info = hextocharCookie($info);
      $iv = hextocharCookie($iv);
      $items = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv));
      $user_id = $items[0];
      $email = $items[1];
      $token = $items[2];
    }

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    
    $login_query = "
    select user_id, token, passwd
    from utenti
    where email = '{$email}'";
  
    $result = pg_query($db, $login_query) or die('Query failed:'.pg_last_error());
    $line = pg_fetch_array($result, null, PGSQL_NUM); //array with indexes a number
    pg_free_result($result);
    pg_close($db);

    if(!($email == "" || $password == "")){
      // If either email or password are set, I prioritize the login throught those
      if(!password_verify($password, $line[2])){ // they don't match
        // deleting cookie
        setcookie("iv", "", time() - 3600, $path="/");
        setcookie("saveduser", "", time() - 3600, $path="/");
        setcookie("temporary", "", time() - 3600, $path="/");

        echo json_encode(array('error' => 'passwd_error'));
        die();
      } else {
        // encrypting the information
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
        //line[0] is the userid and line[1] is the token
        $info = openssl_encrypt("{$line[0]}{$delimiter}{$email}{$delimiter}{$line[1]}", "aes-256-cbc", "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv);

        if($remember){ //saving the token since "remember me has been selected
          // Expires in 90 days
          $ninetydays = time() + 3600*24*90;

          // I am setting the cookie so that each backslash is saved as such in javascript
          setcookie("saveduser", $info, $expires_or_options=$ninetydays, $path="/");
          setcookie("iv", $iv, $expires_or_options=$ninetydays, $path="/");
          setcookie("temporary", "false", $expires_or_options=0, $path="/");
        } else {
          // This cookie will expire after closing the session. This is used for user identification
          setcookie("saveduser", $info, $expires_or_options=0, $path="/");
          setcookie("iv", $iv, $expires_or_options=0, $path="/");
          setcookie("temporary", "true", $expires_or_options=0, $path="/");
        }

        echo json_encode(array('success' => '1'));
        die();
      }
    } else {
      if(!$user_id == $line[0] || !$token == $line[1]){
        // deleting cookie
        setcookie("iv", "", time() - 3600, $path="/");
        setcookie("saveduser", "", time() - 3600, $path="/");
        setcookie("temporary", "", time() - 3600, $path="/");

        echo json_encode(array('error' => 'info_error'));
        die();
      } else {
        // if the user selected remember me last time, I have to update the "last login" by updating the cookie time
        if($expiry == "false"){
          $ninetydays = time() + 3600*24*90;

          // I am setting the cookie so that each backslash is saved as such in javascript
          setcookie("saveduser", $info, $expires_or_options=$ninetydays, $path="/");
          setcookie("iv", $iv, $expires_or_options=$ninetydays, $path="/");
          setcookie("temporary", "false", $expires_or_options=0, $path="/");
        }

        echo json_encode(array('success' => '1'));
        die();
      }
    }
  }
?>