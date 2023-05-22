<?php
  if(array_key_exists("loadContenuto", $_POST)) { loadContenuto($_POST['kind']); }
  else if(array_key_exists("cerca", $_POST)) { cerca($_POST["nome"]); }
  else if(array_key_exists("cambiaCategoria", $_POST)) { cambiaCategoria(); }
  else if(array_key_exists("getSuggerimenti", $_POST)) { getSuggerimenti(); }
  else if(array_key_exists("tuttiRistoranti", $_POST)) { tuttiRistoranti(); }
  else if(array_key_exists("tutteCucine", $_POST)) { tutteCucine(); }

  function loadContenuto($kind) {
    $query = "select rest_id, nome, immagine, indirizzo, costo_consegna, voto, prezzo, descrizione from ristoranti where categoria = '{$kind}';";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $query) or die('Query failed:'.pg_last_error());

    $rests = pg_fetch_all($result, PGSQL_ASSOC);
    if(!$rests) {echo json_encode(array('error' => '1', 'errorkind' => 'kindnotfound')); die(); }
    
    pg_free_result($result);
    pg_close($db);

    die(json_encode(array('success' => '1', 'restaurants' => $rests)));
  }

  function cerca($name) {
    $query = "select rest_id from ristoranti where nome = '{$name}';";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result = pg_query($db, $query) or die('Query failed:'.pg_last_error());

    $restid = pg_fetch_row($result, null, PGSQL_NUM)[0];
    if(!$restid) {echo json_encode(array('success' => '1', 'found' => 'false')); die(); }
    
    pg_free_result($result);
    pg_close($db);

    die(json_encode(array('success' => '1', 'found' => 'true', 'rest_id' => $restid)));
  }

  function tutteCucine() {
    $validtoken="select distinct categoria from ristoranti";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while($line=pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $data[]=$line;
    }
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }

  function tuttiRistoranti() {
    $validtoken="select nome, rest_id from ristoranti order by nome";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

    $result = pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $res = pg_fetch_all($result, PGSQL_ASSOC);

    if($res == false) {die(json_encode(array("success" => "0", "error" => "norestfound"))); }
    pg_free_result($result);
    pg_close($db);

    echo json_encode(array("success" => "1", "rests" => $res));
  }

  function getSuggerimenti() {
    $validtoken="select nome from ristoranti";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while($line=pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $data[]=$line;
    }
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }

  function cambiaCategoria() {
    $validtoken="select distinct categoria from ristoranti";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while($line=pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $data[]=$line;
    }
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }
?>