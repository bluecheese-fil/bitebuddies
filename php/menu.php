<?php
  if(array_key_exists("menu", $_POST)) { menu(); }
  if(array_key_exists("ristoranti", $_POST)) { ristoranti(); }
  if(array_key_exists("change", $_POST)) { change(); }
  if(array_key_exists("loadQuantita", $_POST)) { loadQuantita(); }

  /*1*/
  function menu() {
    $validtoken1="select * from menù";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=postgres password=patatine1") or die('Could not connect:'.pg_last_error());
    $result1=pg_query($db, $validtoken1) or die('Query failed:'.pg_last_error());
    $data1=array();
    while ($line=pg_fetch_array($result1, null, PGSQL_ASSOC)) {
      $data1[]=$line;
    }
    pg_free_result($result1);
    pg_close($db);
    echo json_encode($data1);
  }

  /*2*/
  function change() {
    $validtoken1="select * from menù";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=postgres password=patatine1") or die('Could not connect:'.pg_last_error());
    $result1=pg_query($db, $validtoken1) or die('Query failed:'.pg_last_error());
    $data1=array();
    while ($line=pg_fetch_array($result1, null, PGSQL_ASSOC)) {
      $data1[]=$line;
    }
    pg_free_result($result1);
    pg_close($db);
    echo json_encode($data1);
  }

  /*3*/
  function ristoranti() {
    $validtoken2="select * from ristoranti order by rest_id";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=postgres password=patatine1") or die('Could not connect:'.pg_last_error());
    $result2=pg_query($db, $validtoken2) or die('Query failed:'.pg_last_error());
    $data2=array();
    while ($line = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
      $data2[] = $line;
    }
    pg_free_result($result2);
    pg_close($db);
    echo json_encode($data2);
  }

  function loadQuantita() {
    $validtoken2="select * from menù";
    $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=postgres password=patatine1") or die('Could not connect:'.pg_last_error());
    $result2=pg_query($db, $validtoken2) or die('Query failed:'.pg_last_error());
    $data2=array();
    while ($line = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
      $data2[] = $line;
    }
    pg_free_result($result2);
    pg_close($db);
    echo json_encode($data2);
  }
?>