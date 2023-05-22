<?php
  function randomToken(){
    $pieces = [];
    for ($i = 0; $i < 255; ++ $i){
      $rand = random_int(33, 126);
      while($rand == 39) $rand = random_int(33, 126); // I don't want any ';', ':' or '''

      $pieces[] = chr($rand);
    }
    return implode('', $pieces);
  }

  function hextocharCookie($hxcookie){
    $cookie = "";
    for ($i = 0; $i < strlen($hxcookie); $i++) {
      if($hxcookie[$i] == "%") $cookie = $cookie.chr(hexdec($hxcookie[++$i].$hxcookie[++$i]));
      else $cookie = $cookie.$hxcookie[$i];
    }

    return $cookie;
  }

  function verifyToken($info, $iv){
    $delimiter = chr(007);
    $cipher = "aes-256-cbc";
    $items = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv));

    $token = "select token from utenti where user_id = '{$items[0]}';";

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $token) or die('Query failed:'.pg_last_error());
    
    $token = pg_fetch_row($result, null, PGSQL_NUM)[0];
    
    pg_free_result($result);
    pg_close($db);
    
    if($token == false || $items[2] != $token) return false;
    return true;
  }

  function deleteLoginCookie(){
    setcookie("iv", "", time() - 3600, $path="/");
    setcookie("saveduser", "", time() - 3600, $path="/");
    setcookie("temporary", "", time() - 3600, $path="/");
  }
?>