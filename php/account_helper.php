<?php
  require "./cookie_helper.php";

  $delimiter = chr(007);
  $iv = $_COOKIE["iv"];
  $info = $_COOKIE["saveduser"];
  $cipher = "aes-256-cbc";
  $items = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv));

  if(array_key_exists("changeToken", $_POST)) { changeToken($delimiter, $cipher, $items); }

  function changeToken($delimiter, $cipher, $items){
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
    $ck = openssl_encrypt("{$items[0]}{$delimiter}{$email}{$delimiter}{$token}", "aes-256-cbc", "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv);
    
    if($_COOKIE["accountexpiry"] == "true"){ //saving the token since "remember me has been selected
      // Expires in 90 days
      $ninetydays = time() + 3600*24*90;
      setcookie("saveduser", $ck, $expires_or_options=$ninetydays, $path="/");
      setcookie("iv", $iv, $expires_or_options=$ninetydays, $path="/");
    } else {
      // This cookie will expire after closing the session. This is used for user identification
      setcookie("saveduser", $info, $expires_or_options=0, $path="/");
      setcookie("iv", $iv, $expires_or_options=0, $path="/");
    }
  }
?>