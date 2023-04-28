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
?>