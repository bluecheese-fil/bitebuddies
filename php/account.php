<?php
  require "./cookie_helper.php";

  $hexiv = $_POST["iv"];
  $iv = hextocharCookie($hexiv);

  $hexinfo = $_POST["saveduser"];
  $info = hextocharCookie($hexinfo);

  if(array_key_exists("changeToken", $_POST)) { changeToken($info, $iv, $_POST["temporary"]); }
  else if(array_key_exists("dynamic", $_POST)) { getItems($info, $iv); }

  function changeToken($info, $iv, $temporary){
    $delimiter = chr(007);
    $cipher = "aes-256-cbc";
    $items = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv));

    $token = randomToken();

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $upd_token = "
    begin;
      update utenti set token = '{$token}' where user_id = {$items[0]};
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

    echo json_encode(array("result"=>"successful"));
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