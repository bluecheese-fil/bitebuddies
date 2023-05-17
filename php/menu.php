<?php
  if(array_key_exists("menu", $_POST)) { menu(); }
  if(array_key_exists("ristoranti", $_POST)) { ristoranti(); }
  if(array_key_exists("change", $_POST)) { change(); }
  if(array_key_exists("loadQuantita", $_POST)) { loadQuantita(); }

  function menu() {
    $validtoken="select * from menu";
    $db = pg_connect("host=localhost port=5433 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while ($line=pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $data[]=$line;
    }
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }

  function change() {
    $validtoken="select * from menu";
    $db = pg_connect("host=localhost port=5433 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while ($line=pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $data[]=$line;
    }
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }

  function ristoranti() {
    $validtoken="select * from ristoranti order by rest_id";
    $db = pg_connect("host=localhost port=5433 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
    $result=pg_query($db, $validtoken) or die('Query failed:'.pg_last_error());
    $data=array();
    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $data[] = $line;
    }
    pg_free_result($result);
    pg_close($db);
    echo json_encode($data);
  }

  function loadQuantita() {
    $validtoken="select * from menu";
    $db = pg_connect("host=localhost port=5433 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
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