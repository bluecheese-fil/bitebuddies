<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/css/homepage.css">
  </head>
  <body>
    <?php
      // db connection
      if(!isset($_COOKIE["saveduser"])){
        echo "
        <div>
          You must first login to access this page! Redirecting you now...
        </div>
        ";

        header('Refresh: 4; URL=/account/login.html');
        die();
      }

      $delimiter = chr(007);
      $iv = $_COOKIE["iv"];
      $info = $_COOKIE["saveduser"];
      $cipher = "aes-256-cbc";
      $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];
      
      // Getting the name from the db
      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

      $default_address = "select indirizzo from indirizzi where user_id = {$usrid} and def_indirizzo = true";
      $result = pg_query($db, $default_address) or die('Query failed:'.pg_last_error());
      $default_address = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
      pg_free_result($result);

      $addresses = "select indirizzo from indirizzi where user_id = {$usrid} and def_indirizzo = false";
      $result = pg_query($db, $addresses) or die('Query failed:'.pg_last_error());
      $addresses = pg_fetch_array($result, null, PGSQL_NUM); //array with addresses, indexed by a number
      pg_free_result($result);

      // This needs to be transformed with a for loop based on the number of the query
      echo "
        <table>
          <div> Indirizzo di default: </div>
          <div> {$default_address} </div>

          <button> Add another address </button>

          <div>
            <div> Indirizzi: </div>
            <button>  </button>
            <button> Make default </button>
            <br>

            <div> Indirizzo 2: </div>
            <button> </button>
            <button> </button>
        </table>
      ";

    ?>
  </body>
</html>