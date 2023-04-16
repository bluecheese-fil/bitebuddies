<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/css/homepage.css">
    <style>

      input {
        margin-bottom: 5px;
        height: 21px;
        border-radius: 10px;
        text-align: left;
        padding-left: 8px;
      }

      .fullin {
        width: 16.5em;
      }

      .halfin {
        width: 7.6em;
      }

      .verticaladdrcontainer {
        float: left;
        margin-right: 5%;
        margin-left: 5%;
        width: 60%;
        padding-top: 12vh;
      }

      .verticalform {
        float: right;

        padding-top: 12vh;

        width: 25%;
        margin-right: 3%;

        height: 10vh;
      }

      .verticaladdresses {
        float: left;

        width: 66%;

        margin-left: 4%;
        height: min(45px, 5vmin);
        line-height: min(45px, 5vmin); /* same as height! */

        display: table-cell;
        vertical-align: middle;
        margin-top: 15px;
      }

      .verticalbuttons {
        float: right;

        width: 27%;
        min-width: 160px;

        height: min(45px, 5vmin);
        margin-top: 15px;
      }

      .errore {
        color: red;
        font-size: small;
      }

      .littleinput{
        width: 46%;
      }


      /* Custom version of "My Buttons"*/
      button {
        height: min(45px, 5vmin);
        padding: 9px 25px;
        background-color: rgba(0, 136, 169, 1);
        border: none;
        border-radius: 50px;
        cursor: pointer;
      }

      button:hover{
        transition-delay: 0.1s;
        transition-duration: 0.4s;
        background-color: rgba(0, 136, 169, 0.8);
      }

    </style>

    <!-- I will create the php functions in here -->
    <?php
      if(array_key_exists('makedefault', $_POST)) { makedefualt($_POST["makedefault"]); }
      else if(array_key_exists('addaddress', $_POST)) { add_address($_POST['addaddress']); }


      // I also need to think on how to get the userid
      function makedefualt($usrid, $address) {
        $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
        
        // I need to call the queries to change the items in makedefault
        
        
        pg_close($db);
      }

      function add_address() {
        echo "This is Button2 that is selected";
      }
    ?>
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
      pg_close($db);

      // This needs to be transformed with a for loop based on the number of the query
      echo "
        <div class=\"verticaladdrcontainer\">
          <div> Indirizzo di default: </div>
          <div> {$default_address} </div>
          <hr>
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
            <div class=\"verticaladdresses\"> Via 2, 00156, Roma </div>
            <div class=\"verticalbuttons\">
              <button> Rendi default </button>
            </div>
            <div class=\"verticaladdresses\"> Via 1, 00133, Roma  </div>
            <div class=\"verticalbuttons\">
              <button> Rendi default </button>
            </div>
          </div>
        ";
      }

      echo "
        </div>
        <div class=\"verticalform\">
          <form style=\"padding-top: 10vh;\" id=\"addaddress\" action=\"\" method=\"post\">
            Indirizzo: <br>
            <input class=\"fullin\" type=\"text\" name=\"indirizzo\" id=\"indirizzo\" onblur=\"checkIndirizzo()\" oninput=\"checkIndirizzo()\"> <br>
            <span style=\"width: 7.5em; display: inline-block;\"> CAP: </span> <span> Citta: </span> <br>
            <input class=\"halfin\" type=\"text\" name=\"cap\" id=\"cap\" maxlength=\"5\" minlength=\"5\" onblur=\"checkIndirizzo()\" oninput=\"checkIndirizzo()\">
            <input class=\"halfin\" type=\"text\" name=\"citta\" id=\"citta\" onblur=\"checkIndirizzo()\" oninput=\"checkIndirizzo()\">
            <div class=\"errore\" id=\"errorindirizzo\" hidden> Indirizzo non completo </div>
            <div class=\"errore\" id=\"capinvalida\" hidden> Cap non corretto </div>
            <button type=\"button\" onclick=\"verifyForm()\"> Aggiungi Indirizzo </button>
          </form>
        </div>
      ";
    ?>
  </body>
</html>