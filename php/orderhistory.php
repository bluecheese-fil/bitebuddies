<?php
  require "./cookie_helper.php";

  if(array_key_exists("getItems", $_POST)) { orderInfo($_POST["order"]); }
  else if(array_key_exists("getNameNOrders", $_POST)) { getNameNOrders($_POST["saveduser"], $_POST["iv"]); }

  function orderInfo($order_id){
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

    $orders = "
      select item, qt
      from contenuto
      where order_id = '{$order_id}'
    ";
    $result = pg_query($db, $orders) or die('Query failed:'.pg_last_error());
    $orders = pg_fetch_all($result, PGSQL_NUM);
    pg_free_result($result);

    $name = "
      select ristoranti.nome
      from ristoranti join ordini on ristoranti.rest_id = ordini.rest_id
      where order_id = '{$order_id}'
    ";
    $result = pg_query($db, $name) or die('Query failed:'.pg_last_error());
    $name = pg_fetch_row($result)[0];
    pg_free_result($result);

    pg_close($db);
  
    echo json_encode(array('success' => 1, 'items' => $orders, 'rist' => $name));
  }

  function getNameNOrders($hexinfo, $hexiv){
    $info = hextocharCookie($hexinfo);
    $iv = hextocharCookie($hexiv);
    $delimiter = chr(007);
    $cipher = "aes-256-cbc";

    $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $usridexists = "select user_id from utenti where user_id = '{$usrid}'";
    $result = pg_query($db, $usridexists) or die('Query failed:'.pg_last_error());
    if($result == null){ echo json_encode(array('success' => 1, 'usrfound' => 0)); die(); }
    pg_free_result($result);
  
    $orders = "select order_id, date from ordini where user_id = '{$usrid}' order by date desc";
    $result = pg_query($db, $orders) or die('Query failed:'.pg_last_error());
    $orders = pg_fetch_all($result, PGSQL_NUM);
    pg_free_result($result);

    $name = "select nome from persone where user_id = '{$usrid}'";
    $result = pg_query($db, $name) or die('Query failed:'.pg_last_error());
    $name = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
    pg_free_result($result);

    pg_close($db);
    if($orders == null) echo json_encode(array('success' => 1, 'name' => $name, 'orders' => 'none'));
    else echo json_encode(array('success' => 1, 'name' => $name, 'orders' => $orders)); 
  }
?>