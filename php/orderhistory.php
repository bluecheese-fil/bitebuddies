<?php
  require "./cookie_helper.php";
  
  $info = hextocharCookie($_POST["saveduser"]);
  $iv = hextocharCookie($_POST["iv"]);
  
  // checking that iv is correct and that token matches with server
  if(strlen($iv) != openssl_cipher_iv_length("aes-256-cbc") || !verifyToken($info, $iv)) { deleteLoginCookie(); die(json_encode(array('success' => 1, 'usrfound' => 0))); }

  if(array_key_exists("getNameNOrders", $_POST)) { getNameNOrders($info, $iv); }
  else if(array_key_exists("getOrder", $_POST)) { getOrder($_POST["order_id"]); }

  function getNameNOrders($info, $iv){
    $delimiter = chr(007); $cipher = "aes-256-cbc";

    $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $usridexists = "select user_id from utenti where user_id = '{$usrid}'";
    $result = pg_query($db, $usridexists) or die('Query failed:'.pg_last_error());
    if($result == null){ echo json_encode(array('success' => 1, 'usrfound' => 0)); die(); }
    pg_free_result($result);
  
    $orders = "select o.order_id, o.data, r.immagine from ordini as o join ristoranti as r on o.rest_id = r.rest_id where o.user_id = '{$usrid}' order by o.data desc";
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

  function getOrder($orderid){
    /*
      I need:
        - Restaurant name
        - Items and quantities
        - Address
        - Date and time of the delivery
    */

    $orderinfo = "select rest_id, data, orario, indirizzo, prezzo from ordini where order_id = '{$orderid}'";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $orderinfo) or die('Query failed:'.pg_last_error());
    $orderinfo = pg_fetch_array($result, null, PGSQL_NUM);
    pg_free_result($result);

    $restid = $orderinfo[0];
    // converting data string
    $data = substr($orderinfo[1], 8, 2)."/".substr($orderinfo[1], 5, 2)."/".substr($orderinfo[1], 0, 4);
    $time = substr($orderinfo[2], 0, 5); // removing seconds

    $restname = "select nome from ristoranti where rest_id = '{$restid}'";
    $result = pg_query($db, $restname) or die('Query failed:'.pg_last_error());
    $restname = pg_fetch_array($result, null, PGSQL_NUM)[0];
    pg_free_result($result);

    // I now need to get the items ordered and the respecitve quantities
    $items = "select oggetto, qt from contenuto where order_id = '{$orderid}'";
    $result = pg_query($db, $items) or die('Query failed:'.pg_last_error());
    $items = pg_fetch_all($result, PGSQL_NUM);
    pg_free_result($result);

    pg_close($db);

    // I can now send all of this information back to the user
    echo json_encode(array("result" => "successful", "name" => $restname, "data" => $data, "delivery" => $time, "items" => $items, "price" => $orderinfo[4], "address" => $orderinfo[3]));
  }
?>