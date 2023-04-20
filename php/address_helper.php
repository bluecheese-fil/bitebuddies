<?php
  $delimiter = chr(007);
  $iv = $_COOKIE["iv"];
  $info = $_COOKIE["saveduser"];
  $cipher = "aes-256-cbc";
  $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];

  if(array_key_exists("mkdef", $_POST)) { makedefault($usrid, $_POST["mkdef"]); }
  else if(array_key_exists("addadr", $_POST)) add_address($usrid, $_POST["addadr"]);
  else if(array_key_exists("del", $_POST)){ delete_address($usrid, $_POST["del"]); }


  function delete_address($usrid, $address){
    $address = str_replace("'", "&#39", $address);
    $query = "delete from indirizzi where user_id = '{$usrid}' and indirizzo = '{$address}'";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $query) or die('Query failed:'.pg_last_error());

    $items = pg_fetch_array($result, null, PGSQL_NUM); //array with indexes a number
    
    pg_free_result($result);
    pg_close($db);
    echo json_encode(array('success' => 1));
  }

  // I also need to think on how to get the userid
  function makedefault($usrid, $address) {
    $address = str_replace("'", "&#39", $address);
    $upd_transaction = "
    begin;
    do
    $$
    declare
      indi varchar;
    begin
      select indirizzo into indi from indirizzi where user_id = '{$usrid}' and def_indirizzo ='true';
      if not found then
        raise exception 'no row found';
      else
        update indirizzi set def_indirizzo = 'false' where user_id = '{$usrid}' and indirizzo = indi;
        update indirizzi set def_indirizzo = 'true' where user_id = '{$usrid}' and indirizzo = '{$address}';
      end if;
    end;
    $$;
    commit;";

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    // I need to call the querie to update the default address
    $result = pg_query($db, $upd_transaction) or die('Query failed:'.pg_last_error());
    pg_free_result($result);
    pg_close($db);

    echo json_encode(array('success' => 1));
  }

  function add_address($usrid, $address) {
    $address = str_replace("'", "&#39", $address);
    $ins_query = "insert into indirizzi(user_id, indirizzo, def_indirizzo) values('{$usrid}', '{$indirizzo}', false);";

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    // I need to call the querie to add the address
    $result = pg_query($db, $ins_query) or die('Query failed:'.pg_last_error());
    pg_free_result($result);
    pg_close($db);

    echo json_encode(array('success' => 1));
  }
?>