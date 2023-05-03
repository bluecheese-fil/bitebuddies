<?php
  require "./cookie_helper.php";

  if(array_key_exists("placeOrder", $_POST)) { placeOrder($_POST["saveduser"], $_POST["iv"], $_POST["restid"], $_POST["addr"], $_POST["delivery"], $_POST["items"]); }

  function placeOrder($hexinfo, $hexiv, $restid, $addr, $date, $delivery, $items){
    $info = hextocharCookie($hexinfo);
    $iv = hextocharCookie($hexiv);

    $delimiter = chr(007);
    $cipher = "aes-256-cbc";
    $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];

    $query = "
      begin;
        insert into ordini(user_id, rest_id, data, orario, indirizzo) values('{$usrid}', '{$restid}', '{$date}', '{$delivery}', '{$addr}');
      do
      $$
      declare
        orderid int;
      begin
        select order_id into orderid from ordini where user_id = '{$usrid}' and rest_id = '{$restid}' and data = '{$date}' and orario = '{$delivery}'
        if not found then
          raise exception 'no row found';
        else";
    
    for($i = 0; $i < count($items); $i++) $query = $query."\t\insert into contenuto(order_id, item, qt) values (orderid, '{$items[$i][0]}', '$items[$i][1]')";

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

?>