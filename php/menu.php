<?php
  $id = $_POST["restid"];
  if(!is_numeric($id)){ echo json_encode(array("success" => 1, "error" => "restnotfound")); die();}

  if(array_key_exists("menu", $_POST)) { menu($id); }
  else if(array_key_exists("ristoranti", $_POST)) { getRest($id); }

  function menu($id) {
    $menuquery="select oggetto, categoria, prezzo, ingrediente1, ingrediente2, ingrediente3 from menu where rest_id = '{$id}' order by categoria";

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $menuquery) or die('Query failed:'.pg_last_error());
    if(!$result) {
      pg_close($db); pg_free_result($result);
      echo json_encode(array("success" => 1, "error" => "restnotfound"));
      die();
    }
    
    $menu = pg_fetch_all($result, PGSQL_ASSOC);
    pg_free_result($result);
    pg_close($db);

    echo json_encode(array("success" => 1, "menu" => $menu));
    return $menu;
  }

  function getRest($id) {
    $restquery = "select nome, immagine, orapertura, orachiusura, indirizzo, costo_consegna, prezzo, categoria, descrizione, voto from ristoranti where rest_id = '{$id}'";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $restquery) or die('Query failed:'.pg_last_error());
    $info = pg_fetch_array($result, null, PGSQL_ASSOC);
    pg_free_result($result);
    pg_close($db);
    
    if(!$info) { echo json_encode(array("success" => 1, "error" => "restnotfound")); die(); }
    echo json_encode(array("success" => 1, "info" => $info));
    return $info;
  }
?>