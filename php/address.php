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

  $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];

  if(array_key_exists("mkdef", $_POST)) { makedefault($usrid, $_POST["mkdef"]); }
  else if(array_key_exists("addadr", $_POST)) add_address($usrid, $_POST["addadr"]);
  else if(array_key_exists("del", $_POST)){ delete_address($usrid, $_POST["del"]); }
  else if(array_key_exists("dynamic", $_POST)){ return_info($usrid);}

  function return_info($usrid){
      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

      $usridexists = "select user_id from utenti where user_id = '{$usrid}'";
      $result = pg_query($db, $usridexists) or die('Query failed:'.pg_last_error());
      if($result == null){
        echo json_encode(array('success' => 1, 'usrfound' => 0));
        die();
      }
      
      pg_free_result($result);

      $default_address = "select indirizzo from indirizzi where user_id = '{$usrid}' and def_indirizzo = 'true'";
      $result = pg_query($db, $default_address) or die('Query failed:'.pg_last_error());
      $default_address = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
      pg_free_result($result);

      $addresses = "select indirizzo from indirizzi where user_id = '{$usrid}' and def_indirizzo = 'false'";
      $result = pg_query($db, $addresses) or die('Query failed:'.pg_last_error());
      $addresses = pg_fetch_all($result, PGSQL_NUM); //array with addresses, indexed by a number
      pg_free_result($result);
      
      $name = "select nome from persone where user_id = '{$usrid}'";
      $result = pg_query($db, $name) or die('Query failed:'.pg_last_error());
      $name = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
      pg_free_result($result);
      pg_close($db);

    echo json_encode(array('success' => 1, 'usrfound' => 1, 'nome' => $name, 'indefault' => $default_address, 'indirizzi' => $addresses));
  }

  function delete_address($usrid, $address){
    $address = str_replace("'", "&#39", $address);
    $query = "delete from indirizzi where user_id = '{$usrid}' and indirizzo = '{$address}'";
    
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $query) or die('Query failed:'.pg_last_error());
        
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
    $ins_query = "insert into indirizzi(user_id, indirizzo, def_indirizzo) values('{$usrid}', '{$address}', false);";

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    // I need to call the querie to add the address
    $result = pg_query($db, $ins_query) or die('Query failed:'.pg_last_error());
    pg_free_result($result);
    pg_close($db);

    echo json_encode(array('success' => 1));
  }
?>