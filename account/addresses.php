<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/css/homepage.css">
    <link rel="stylesheet" href="/css/mybuttons.css">

    <style>

      .verticaldiv {
        float: left;
        margin-left: 13vw;
        padding-top: 10vh;
      }

    </style>

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
        <div class=\"verticaldiv\">
          <div> Indirizzo di default: </div>
          <div> {$default_address} </div>
          <hr> <br>
      ";
      
      //<button> Add another address </button>
      if($addresses != false || true){
        /*
        $addr_len = count($addresses);
        if($addr_len > 0) echo "
            <div> Indirizzi: <\div>
            <hr> <br>
          ";

        for($i = 0; $i < count($addresses); $i++){

        }
        */

        // I need to take care of different size addresses
        // I also need to make the spacing between the vertical tab dipendent of the size of the divs
        // Right now it's not working great
        echo "
            <div>
              <div> 
                Via 2, 00156, Roma
                <button> Make default </button>
              </div>
              <br>

              <div>
                Via 1, 00133, Roma
                <button> Make default </button>
              </div>
              <br>
            </div>
        ";
      }

      echo "
        </div>
        <div class=\"verticaldiv\">
          <form aggiungi_indirizzo>
            Indirizzo:
            <input type=\"text\">
          </form>
        </div>
      ";
    ?>
  </body>
</html>