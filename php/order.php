<?php
  require "./cookie_helper.php";
  require "./menu.php";
  
  $info = hextocharCookie($_POST["saveduser"]);
  $iv = hextocharCookie($_POST["iv"]);
  
  // checking that iv is correct
  if(strlen($iv) != 16) { echo json_encode(array('success' => 1, 'usrfound' => 0)); die(); }

  if(array_key_exists("placeOrder", $_POST)) { placeOrder($info, $iv, $_POST["restid"], $_POST["where"], $_POST["date"], $_POST["time"], $_POST["selecteditems"], $_POST["total"]); }

  function placeOrder($info, $iv, $restid, $where, $whendate, $whentime, $items, $total){
    $delimiter = chr(007);
    $cipher = "aes-256-cbc";
    $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];

    $restaurant = getRest($restid);
    $fd = fopen("php://stdout", 'w');

    $deliverycost = $restaurant["costo_consegna"];
    $address = $restaurant["indirizzo"];
    unset($restaurant);

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

    $price = 0;
    for ($index = 0; $index < count($items) ; $index++) { 
      $itemprice = getPrice($db, $restid, $items[$index][0]);
      if($itemprice == "itemnotfound") {
        pg_close($db);

        echo json_encode(array("error" => 1, "errortype" => "unmatcheditems"));
        die();
      } else $price += floatval($itemprice) * intval($items[$index][1]);
    }

    pg_close($db);

    if($where == "takeaway") { $price += $deliverycost; $where = $address; }
    if($price != floatval($total)){
      echo json_encode(array("error" => 1, "errortype" => "unmatchedprice"));
      die();
    }

    $query = "
      begin;
        insert into ordini(user_id, rest_id, data, orario, indirizzo, prezzo) values('{$usrid}', '{$restid}', '{$whendate}', '{$whentime}', '{$where}', '{$price}');
      do
      $$
      declare
        orderid int;
      begin
        select order_id into orderid from ordini where user_id = '{$usrid}' and rest_id = '{$restid}' and data = '{$date}' and orario = '{$delivery}'
        if not found then
          raise exception 'no row found';
        else";
    
    for($i = 0; $i < count($items); $i++) $query = $query."\t\insert into contenuto(order_id, item, qt) values (orderid, '{$items[$i][0]}', '{$items[$i][1]}')";

    $query = $query."
        end if;
      end;
      $$;
      commit;
    ";

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

    $result = pg_query($db, $query) or die('Query failed:'.pg_last_error());
    pg_free_result($result);

    // getting the order_id
    $orderid = "select order_id from ordini where user_id = '{$usrid}' and rest_id = '{$restid}' and data = '{$date}' and orario = '{$delivery}' and indirizzo = '{$addr}'";
    $result = pg_query($db, $query) or die('Query failed:'.pg_last_error());
    $orderid = pg_fetch_array($result, null, PGSQL_NUM)[0];
    pg_free_result($result);

    pg_close($db);
    echo json_encode(array("result"=>"successful", "orderid" => $orderid));
  }

  function getPrice($db, $rest_id, $name){
    $query = "select prezzo from menu where rest_id = '{$rest_id}' and oggetto = '{$name}'";
    $result = pg_query($db, $query) or die('Query failed:'.pg_last_error());
    $info = pg_fetch_row($result, null, PGSQL_NUM);
    pg_free_result($result);
    
    if(!$info) return "itemnotfound";
    return $info[0];
  }
?>