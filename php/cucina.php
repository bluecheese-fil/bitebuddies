<?php
  if(array_key_exists("loadContenuto", $_POST)) { loadContenuto(); }
  if(array_key_exists("cambiaCategoria", $_POST)) { cambiaCategoria(); }
  if(array_key_exists("getSuggerimenti", $_POST)) { getSuggerimenti(); }
  if(array_key_exists("tuttiRistoranti", $_POST)) { tuttiRistoranti(); }
  if(array_key_exists("tutteCucine", $_POST)) { tutteCucine(); }

  function loadContenuto() {
    $validtoken="select * from ristoranti order by rest_id";
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

  function tutteCucine() {
    $validtoken="select distinct categoria from ristoranti";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while($line=pg_fetch_array($result, null, PGSQL_ASSOC)) $data[]=$line;
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }

  function tuttiRistoranti() {
    $validtoken="select nome from ristoranti order by nome";
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