<?php
  require "./cookie_helper.php";

  $delimiter = chr(007);
  $cipher = "aes-256-cbc";
  $hexiv = $_POST["iv"];
  $hexinfo = $_POST["saveduser"];

  // The special characters in IV and INFO are rapresented by hex, like so %0F.
  // Those must be changed to prevent errors in the decrypt
  $iv = hextocharCookie($hexiv);
  $info = hextocharCookie($hexinfo);

  // checking that iv is correct
  if(strlen($iv) != 16) { echo json_encode(array('success' => 1, 'usrfound' => 0)); die(); }

  $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];
  if($usrid == ''){
    echo json_encode(array('success' => 1, 'usrfound' => 0));
    die();
  }

  // Getting the name from the db
  $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

  $usridexists = "select user_id from utenti where user_id = '{$usrid}'";
  $result = pg_query($db, $usridexists) or die('Query failed:'.pg_last_error());
  if($result == null){
    echo json_encode(array('success' => 1, 'usrfound' => 0));
    die();
  }
  pg_free_result($result);

  $name = "select nome from persone where user_id = '{$usrid}'";
  $result = pg_query($db, $name) or die('Query failed:'.pg_last_error());
  $name = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
  pg_free_result($result);
  pg_close($db);

  echo json_encode(array('success' => 1, 'usrfound' => 1, 'name' => $name));
?>