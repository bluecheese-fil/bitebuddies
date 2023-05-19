<?php
  $id = $_POST["id"];
  if(!is_numeric($id)){
    echo json_encode(array("success" => 1, "error" => "restnotfound"));
  }

  if(array_key_exists("menu", $_POST)) { menu($id); }
  else if(array_key_exists("ristoranti", $_POST)) { getRest($id); }
  else if(array_key_exists("change", $_POST)) { change(); }
  else if(array_key_exists("loadQuantita", $_POST)) { loadQuantita($id); }

  function menu($id) {
    $menuquery="select oggetto, categoria, prezzo, ingrediente1, ingrediente2, ingrediente3 from menu where rest_id = '{$id}' order by categoria";

    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $menuquery) or die('Query failed:'.pg_last_error());
    if(!$result) { echo json_encode(array("success" => 1, "error" => "restnotfound"));}

    $menu = pg_fetch_all($result, PGSQL_ASSOC);
    pg_free_result($result);
    pg_close($db);
    echo json_encode(array("success" => 1, "menu" => $menu));
  }

  function change() {
    $validtoken="select * from menu";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while ($line=pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $data[]=$line;
    }
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }

  function getRest($id) {
    $restquery = "select nome, immagine, orapertura, orachiusura, indirizzo, costo_consegna, prezzo, categoria, descrizione, voto from ristoranti where rest_id = '{$id}'";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $restquery) or die('Query failed:'.pg_last_error());
    if(!$result) { echo json_encode(array("success" => 1, "error" => "restnotfound"));}

    $info = pg_fetch_array($result, null, PGSQL_ASSOC);
    pg_free_result($result);
    pg_close($db);
    echo json_encode(array("success" => 1, "info" => $info));
  }

  function loadQuantita() {
    $validtoken="select * from menu";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $data[] = $line;
    }
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }
?>